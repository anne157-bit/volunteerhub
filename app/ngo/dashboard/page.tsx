'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { requireNGO } from '@/lib/utils/auth-guard';
import { getNGOOpportunities } from '@/lib/firebase/opportunities';
import { getApplicationCount } from '@/lib/firebase/applications';
import { useState } from 'react';
import type { Opportunity } from '@/types/opportunity';
import type { NGO } from '@/types/user';
import Navbar from '@/components/Navbar';

export default function NGODashboardPage() {
  const router = useRouter();
  const { user, profile, loading, profileComplete, isNGO: userIsNGO } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loadingOpportunities, setLoadingOpportunities] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }

    if (!loading && user && !profileComplete) {
      router.push('/onboarding/ngo');
      return;
    }

    if (!loading && user && profile && !userIsNGO) {
      router.push('/dashboard');
      return;
    }

    // Load opportunities if user is NGO
    if (user && profile && userIsNGO) {
      loadOpportunities();
    }
  }, [user, profile, loading, profileComplete, userIsNGO, router]);

  const loadOpportunities = async () => {
    if (!user || !profile || !requireNGO(user, profile)) return;

    try {
      setLoadingOpportunities(true);
      const ngoProfile = profile as NGO;
      const opps = await getNGOOpportunities(ngoProfile.id);
      
      // Load application counts for each opportunity
      const opportunitiesWithCounts = await Promise.all(
        opps.map(async (opp) => {
          const applicationCount = await getApplicationCount(opp.id);
          return {
            ...opp,
            stats: {
              ...opp.stats,
              applications: applicationCount,
            },
          };
        })
      );
      
      setOpportunities(opportunitiesWithCounts);
    } catch (error) {
      console.error('Error loading opportunities:', error);
    } finally {
      setLoadingOpportunities(false);
    }
  };

  if (loading || loadingOpportunities) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile || !requireNGO(user, profile)) {
    return null;
  }

  const ngoProfile = profile as NGO;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {ngoProfile.organizationName}!
            </h1>
            <p className="mt-2 text-gray-700">Your NGO dashboard</p>
          </div>
          <Link
            href="/ngo/opportunities/new"
            className="px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Opportunity
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Total Opportunities
            </h2>
            <p className="text-3xl font-bold text-blue-600">
              {ngoProfile.stats.totalOpportunities}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Total Volunteers
            </h2>
            <p className="text-3xl font-bold text-green-600">
              {ngoProfile.stats.totalVolunteers}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Fill Rate
            </h2>
            <p className="text-3xl font-bold text-purple-600">
              {ngoProfile.stats.fillRate.toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Your Opportunities
            </h2>
            <Link
              href="/ngo/opportunities/new"
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              Create New
            </Link>
          </div>

          {opportunities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-700 mb-4">No opportunities yet</p>
              <Link
                href="/ngo/opportunities/new"
                className="inline-block px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Create Your First Opportunity
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {opportunities.map((opp) => (
                <div
                  key={opp.id}
                  role="button"
                  tabIndex={0}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/opportunities/${opp.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      router.push(`/opportunities/${opp.id}`);
                    }
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {opp.title}
                      </h3>
                      <p className="text-sm text-gray-700 mt-1">
                        {opp.description.substring(0, 100)}...
                      </p>
                      <div className="mt-2 flex gap-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            opp.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : opp.status === 'draft'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {opp.status}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800">
                          {opp.cause}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-700">
                        {opp.capacity.filled} / {opp.capacity.total} volunteers
                      </p>
                      <p className="text-sm text-gray-700">
                        {opp.stats.applications} applications
                      </p>
                      {opp.status === 'active' && opp.stats.applications > 0 && (
                        <Link
                          href={`/ngo/opportunities/${opp.id}/candidates`}
                          className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View candidates
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Organization Info
          </h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Location:</span>{' '}
              {ngoProfile.location.city}, {ngoProfile.location.state}
            </p>
            <p>
              <span className="font-medium">Impact Areas:</span>{' '}
              {ngoProfile.impactAreas.join(', ')}
            </p>
            <p>
              <span className="font-medium">Verification Status:</span>{' '}
              <span
                className={`px-2 py-1 text-xs font-medium rounded ${
                  ngoProfile.verification.status === 'verified'
                    ? 'bg-green-100 text-green-800'
                    : ngoProfile.verification.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {ngoProfile.verification.status}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

