'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { getApplicationsForVolunteer } from '@/lib/firebase/applications';
import type { ApplicationWithOpportunity } from '@/lib/firebase/applications';
import Navbar from '@/components/Navbar';

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, loading, profileComplete } = useAuth();
  const [applications, setApplications] = useState<ApplicationWithOpportunity[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    } else if (!loading && user && !profileComplete) {
      router.push('/onboarding/volunteer');
    } else if (!loading && user && profileComplete && profile) {
      loadApplications();
    }
  }, [user, profile, loading, profileComplete, router]);

  const loadApplications = async () => {
    if (!user) return;

    try {
      setLoadingApplications(true);
      const apps = await getApplicationsForVolunteer(user.uid);
      setApplications(apps);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoadingApplications(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {profile.name}!
          </h1>
          <p className="mt-2 text-gray-700">Your volunteer dashboard</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Total Hours
            </h2>
            <p className="text-3xl font-bold text-blue-600">
              {profile.stats.totalHours}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Events Completed
            </h2>
            <p className="text-3xl font-bold text-green-600">
              {profile.stats.eventsCompleted ?? 0}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Current Streak
            </h2>
            <p className="text-3xl font-bold text-purple-600">
              {profile.stats.currentStreak ?? 0} days
            </p>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Applied Opportunities
          </h2>
          {loadingApplications ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-700">You haven't applied to any opportunities yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <div
                  key={application.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {application.opportunity.title}
                      </h3>
                      <p className="text-sm text-gray-700 mt-1">
                        {application.opportunity.ngoName}
                      </p>
                      <div className="mt-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            application.status === 'applied'
                              ? 'bg-blue-100 text-blue-800'
                              : application.status === 'shortlisted'
                              ? 'bg-yellow-100 text-yellow-800'
                              : application.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : application.status === 'completed'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {application.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Your Profile
          </h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Location:</span>{' '}
              {profile.location.city}, {profile.location.state}
            </p>
            <p>
              <span className="font-medium">Skills:</span>{' '}
              {profile.skills && profile.skills.length > 0
                ? profile.skills.join(', ')
                : 'Not specified'}
            </p>
            <p>
              <span className="font-medium">Causes:</span>{' '}
              {profile.causes && profile.causes.length > 0
                ? profile.causes.join(', ')
                : 'Not specified'}
            </p>
            <p>
              <span className="font-medium">Availability:</span>{' '}
              {profile.availability?.hoursPerWeek
                ? `${profile.availability.hoursPerWeek} hours/week`
                : 'Not set'}
            </p>
            <p>
              <span className="font-medium">Commitment:</span>{' '}
              {profile.commitment || 'Not set'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


