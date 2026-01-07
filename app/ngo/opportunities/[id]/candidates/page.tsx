'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { requireNGO } from '@/lib/utils/auth-guard';
import { getOpportunityById } from '@/lib/firebase/opportunities';
import { getApplicationsForOpportunity, updateApplicationStatus } from '@/lib/firebase/applications';
import type { Opportunity } from '@/types/opportunity';
import type { NGO } from '@/types/user';
import type { ApplicationWithVolunteer, ApplicationStatus } from '@/lib/firebase/applications';
import Navbar from '@/components/Navbar';

export default function CandidatesPage() {
  const router = useRouter();
  const params = useParams();
  const opportunityId = params.id as string;
  const { user, profile, loading, isNGO: userIsNGO } = useAuth();

  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [applications, setApplications] = useState<ApplicationWithVolunteer[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }

    if (!loading && user && !userIsNGO) {
      router.push('/dashboard');
      return;
    }

    if (user && profile && userIsNGO && opportunityId) {
      loadData();
    }
  }, [user, profile, loading, userIsNGO, opportunityId, router]);

  const loadData = async () => {
    if (!user || !profile || !requireNGO(user, profile)) return;

    try {
      setLoadingData(true);
      setError(null);

      // Load opportunity
      const opp = await getOpportunityById(opportunityId);
      if (!opp) {
        setError('Opportunity not found');
        return;
      }

      // Verify the NGO owns this opportunity
      const ngoProfile = profile as NGO;
      if (opp.ngoId !== ngoProfile.id) {
        setError('You do not have permission to view this opportunity');
        return;
      }

      setOpportunity(opp);

      // Load applications
      const apps = await getApplicationsForOpportunity(opportunityId);
      setApplications(apps);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoadingData(false);
    }
  };

  const handleStatusChange = async (applicationId: string, newStatus: ApplicationStatus) => {
    try {
      setUpdatingStatus(applicationId);
      await updateApplicationStatus(applicationId, newStatus);

      // Update local state
      setApplications(prev =>
        prev.map(app =>
          app.id === applicationId
            ? { ...app, status: newStatus }
            : app
        )
      );
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update application status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: ApplicationStatus): string => {
    switch (status) {
      case 'applied':
        return 'bg-blue-100 text-blue-800';
      case 'shortlisted':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading candidates...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'Opportunity not found'}
            </h1>
            <Link
              href="/ngo/dashboard"
              className="text-blue-600 hover:text-blue-500"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Candidates for {opportunity.title}
              </h1>
              <p className="text-lg text-gray-600">{opportunity.cause}</p>
              <p className="text-sm text-gray-700 mt-1">
                {formatDate(opportunity.schedule.startDate)} - {formatDate(opportunity.schedule.endDate)}
              </p>
            </div>
            <Link
              href={`/ngo/opportunities/${opportunityId}`}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              View Opportunity
            </Link>
          </div>
        </div>

        {/* Applications */}
        {applications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-700 mb-4">No applications yet</p>
            <Link
              href="/ngo/dashboard"
              className="text-blue-600 hover:text-blue-500"
            >
              ← Back to Dashboard
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Applications ({applications.length})
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Volunteer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Match Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {application.volunteer.avatar && (
                            <img
                              className="h-10 w-10 rounded-full mr-3"
                              src={application.volunteer.avatar}
                              alt={application.volunteer.name}
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {application.volunteer.name}
                            </div>
                            <div className="text-sm text-gray-700">
                              {application.volunteer.city}
                            </div>
                            <div className="text-xs text-gray-700">
                              Skills: <span className="text-purple-600">{application.volunteer.skills.slice(0, 3).join(', ')}
                              {application.volunteer.skills.length > 3 && '...'}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {application.matchScore}%
                        </div>
                        <div className="text-xs text-gray-500">
                          {application.matchScore >= 80 ? 'Great match' : application.matchScore >= 60 ? 'Good match' : 'Fair match'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(application.status)}`}>
                          {application.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatDate(application.appliedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {application.status === 'applied' && (
                            <button
                              onClick={() => handleStatusChange(application.id, 'shortlisted')}
                              disabled={updatingStatus === application.id}
                              className="px-3 py-1 text-xs font-medium text-white bg-yellow-600 hover:bg-yellow-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {updatingStatus === application.id ? 'Updating...' : 'Shortlist'}
                            </button>
                          )}
                          {(application.status === 'applied' || application.status === 'shortlisted') && (
                            <button
                              onClick={() => handleStatusChange(application.id, 'confirmed')}
                              disabled={updatingStatus === application.id}
                              className="px-3 py-1 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {updatingStatus === application.id ? 'Updating...' : 'Confirm'}
                            </button>
                          )}
                          {application.status === 'confirmed' && (
                            <span className="text-xs text-gray-500">Confirmed</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="mt-8">
          <Link
            href="/ngo/dashboard"
            className="text-blue-600 hover:text-blue-500"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}