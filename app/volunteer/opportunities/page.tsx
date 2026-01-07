'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { requireVolunteer } from '@/lib/utils/auth-guard';
import { getActiveOpportunities } from '@/lib/firebase/opportunities';
import { calculateMatchScore, getMatchLabel } from '@/lib/matching/algorithm';
import type { Opportunity } from '@/types/opportunity';
import type { Volunteer } from '@/types/user';
import { Timestamp } from 'firebase/firestore';
import Navbar from '@/components/Navbar';

export default function VolunteerOpportunitiesPage() {
  const router = useRouter();
  const { user, profile, loading, profileComplete, isVolunteer: userIsVolunteer } = useAuth();
  const [opportunities, setOpportunities] = useState<Array<Opportunity & { matchScore: number; matchLabel: 'High' | 'Medium' | 'Low' }>>([]);
  const [loadingOpportunities, setLoadingOpportunities] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }

    if (!loading && user && !profileComplete) {
      router.push('/onboarding/volunteer');
      return;
    }

    if (!loading && user && profile && !userIsVolunteer) {
      router.push('/ngo/dashboard');
      return;
    }

    // Load opportunities if user is volunteer
    if (user && profile && userIsVolunteer) {
      loadOpportunities();
    }
  }, [user, profile, loading, profileComplete, userIsVolunteer, router]);

  const loadOpportunities = async () => {
    if (!user || !profile || !requireVolunteer(user, profile)) return;

    try {
      setLoadingOpportunities(true);
      setError(null);
      const volunteerProfile = profile as Volunteer;
      const opps = await getActiveOpportunities(50);

      // Calculate match scores for each opportunity
      const opportunitiesWithScores = opps.map((opp) => {
        const matchResult = calculateMatchScore(volunteerProfile, opp);
        return {
          ...opp,
          matchScore: matchResult.totalScore,
          matchLabel: getMatchLabel(matchResult.totalScore),
        };
      });

      // Sort by match score (highest first)
      opportunitiesWithScores.sort((a, b) => b.matchScore - a.matchScore);

      setOpportunities(opportunitiesWithScores);
    } catch (err) {
      console.error('Error loading opportunities:', err);
      setError(err instanceof Error ? err.message : 'Failed to load opportunities');
    } finally {
      setLoadingOpportunities(false);
    }
  };

  const formatDate = (timestamp: Timestamp): string => {
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getMatchChipStyles = (label: 'High' | 'Medium' | 'Low'): string => {
    switch (label) {
      case 'High':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading || loadingOpportunities) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading opportunities...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile || !requireVolunteer(user, profile)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Volunteer Opportunities
          </h1>
          <p className="mt-2 text-gray-600">
            Find opportunities that match your skills and interests
          </p>
        </div>

        {error && (
          <div
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6"
            role="alert"
          >
            {error}
          </div>
        )}

        {opportunities.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-700 mb-4">No active opportunities found</p>
            <p className="text-sm text-gray-700">
              Check back later for new volunteer opportunities
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {opportunities.map((opp) => (
              <Link
                key={opp.id}
                href={`/opportunities/${opp.id}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 flex-1">
                      {opp.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ml-2 ${getMatchChipStyles(
                        opp.matchLabel
                      )}`}
                    >
                      Match: {opp.matchLabel}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {opp.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">NGO:</span>
                      <span>{opp.ngoName}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">Cause:</span>
                      <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                        {opp.cause}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">Location:</span>
                      <span>
                        {opp.location.type === 'remote'
                          ? 'Remote'
                          : opp.location.city && opp.location.state
                          ? `${opp.location.city}, ${opp.location.state}`
                          : opp.location.type}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">Dates:</span>
                      <span>
                        {formatDate(opp.schedule.startDate)} -{' '}
                        {formatDate(opp.schedule.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">Hours:</span>
                      <span>{opp.schedule.hoursRequired} hours required</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-700">
                      <span className="text-purple-600">{opp.capacity.filled}</span> / {opp.capacity.total} volunteers
                    </div>
                    <div className="text-sm font-medium text-blue-600">
                      View Details →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

