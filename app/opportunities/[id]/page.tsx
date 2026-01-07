'use client';

/**
 * Implement the volunteer Apply flow for an opportunity, using our existing types and matching engine.
 * Requirements:
 *
 * In @/lib/firebase/applications.ts, add a createApplication helper:
 *
 * Signature:
 * export async function createApplication(params: {
 *   volunteerId: string;
 *   opportunityId: string;
 *   ngoId: string;
 *   matchScore: number;
 *   matchBreakdown: MatchBreakdown;
 * }): Promise<Application>
 * Behavior:
 *
 * Query applications for an existing doc with the same volunteerId and opportunityId.
 *
 * If one exists, return it (no duplicate).
 *
 * Otherwise create a new document in the applications collection with:
 *
 * status: 'applied'
 *
 * volunteerId, ngoId, opportunityId
 *
 * matchScore, matchBreakdown
 *
 * appliedAt: serverTimestamp()
 *
 * Use strict TypeScript with our existing Application and MatchBreakdown types; no any, no undefined writes.
 *
 * In app/opportunities/[id]/page.tsx:
 *
 * Use useAuth and the existing volunteer profile hook to get the current volunteer and their profile.
 *
 * Add an Apply button that is visible only for authenticated volunteers.
 *
 * On click:
 *
 * If not logged in, redirect to /auth/login.
 *
 * If the volunteer profile is incomplete, show an error message: "Please complete your volunteer profile before applying."
 *
 * Otherwise:
 *
 * Compute the match using calculateMatchScore(volunteerProfile, opportunity) from @/lib/matching/algorithm (or the existing matching util).
 *
 * Call createApplication with the user id, ngo id, opportunity id, match score, and breakdown.
 *
 * Show loading state (Applying...) while the request is in flight.
 *
 * After success, disable the button and change label to "Application submitted".
 *
 * If createApplication throws, show "Failed to submit application" under the button.
 *
 * Ensure the page still works for unauthenticated users (they can view details, but the button should either redirect to login or be hidden).
 *
 * Do not change any routing or styling beyond what is necessary for this Apply flow. Follow .cursorrules (Next.js App Router, strict typing, Firebase best practices).
 */

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { getOpportunityById } from '@/lib/firebase/opportunities';
import { createApplication } from '@/lib/firebase/applications';
import { calculateMatchScore, getMatchLabel } from '@/lib/matching/algorithm';
import type { Opportunity } from '@/types/opportunity';
import type { Volunteer } from '@/types/user';
import type { MatchBreakdown } from '@/types/application';
import { Timestamp } from 'firebase/firestore';
import Navbar from '@/components/Navbar';

export default function OpportunityDetailPage() {
  const router = useRouter();
  const params = useParams();
  const opportunityId = params.id as string;
  const { user, profile, loading, profileComplete, isVolunteer: userIsVolunteer } = useAuth();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [matchLabel, setMatchLabel] = useState<'High' | 'Medium' | 'Low' | null>(null);
  const [loadingOpportunity, setLoadingOpportunity] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [applicationError, setApplicationError] = useState<string | null>(null);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  useEffect(() => {
    if (opportunityId) {
      loadOpportunity();
    }
  }, [opportunityId]);

  const loadOpportunity = async () => {
    if (!opportunityId) return;

    try {
      setLoadingOpportunity(true);
      setError(null);
      const opp = await getOpportunityById(opportunityId);

      if (!opp) {
        setError('Opportunity not found');
        return;
      }

      setOpportunity(opp);

      // Calculate match score if user is volunteer
      if (user && profile && userIsVolunteer) {
        const volunteerProfile = profile as Volunteer;
        const matchResult = calculateMatchScore(volunteerProfile, opp);
        setMatchScore(matchResult.totalScore);
        setMatchLabel(getMatchLabel(matchResult.totalScore));
      }
    } catch (err) {
      console.error('Error loading opportunity:', err);
      setError(err instanceof Error ? err.message : 'Failed to load opportunity');
    } finally {
      setLoadingOpportunity(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (!profileComplete) {
      setApplicationError('Please complete your volunteer profile before applying.');
      return;
    }

    if (!opportunity) {
      setApplicationError('Opportunity not loaded.');
      return;
    }

    try {
      setApplying(true);
      setApplicationError(null);

      const volunteerProfile = profile as Volunteer;
      const matchResult = calculateMatchScore(volunteerProfile, opportunity);

      await createApplication({
        volunteerId: user.uid,
        opportunityId: opportunity.id,
        ngoId: opportunity.ngoId,
        matchScore: matchResult.totalScore,
      });

      setApplicationSubmitted(true);
    } catch (err) {
      console.error('Error submitting application:', err);
      setApplicationError('Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const formatDate = (timestamp: Timestamp): string => {
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateTime = (timestamp: Timestamp): string => {
    const date = timestamp.toDate();
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
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

  if (loading || loadingOpportunity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading opportunity...</p>
        </div>
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Opportunity not found'}
          </h1>
          <Link
            href="/volunteer/opportunities"
            className="text-blue-600 hover:text-blue-500"
          >
            ← Back to Opportunities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Link
          href="/volunteer/opportunities"
          className="text-blue-600 hover:text-blue-500 mb-6 inline-block"
        >
          ← Back to Opportunities
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {opportunity.title}
                </h1>
                <p className="text-lg text-gray-600">{opportunity.ngoName}</p>
              </div>
              {matchLabel && matchScore !== null && (
                <div className="ml-4">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded ${getMatchChipStyles(
                      matchLabel
                    )}`}
                  >
                    Match: {matchLabel} ({matchScore}%)
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-3 py-1 text-sm font-medium rounded bg-blue-100 text-blue-800">
                {opportunity.cause}
              </span>
              <span className="px-3 py-1 text-sm font-medium rounded bg-gray-100 text-gray-800">
                {opportunity.location.type === 'remote'
                  ? 'Remote'
                  : opportunity.location.city && opportunity.location.state
                  ? `${opportunity.location.city}, ${opportunity.location.state}`
                  : opportunity.location.type}
              </span>
              <span
                className={`px-3 py-1 text-sm font-medium rounded ${
                  opportunity.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {opportunity.status}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Description */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Description
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {opportunity.description}
              </p>
            </section>

            {/* Requirements */}
            {opportunity.requirements && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Requirements
                </h2>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {opportunity.requirements}
                </p>
              </section>
            )}

            {/* Skills */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {opportunity.skills.map((skill, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 text-sm font-medium rounded ${
                      skill.importance === 'required'
                        ? 'bg-red-100 text-red-800'
                        : skill.importance === 'preferred'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {skill.name} ({skill.importance})
                  </span>
                ))}
              </div>
            </section>

            {/* Schedule */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Schedule
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Start Date:</span>
                  <span className="font-medium">{formatDate(opportunity.schedule.startDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">End Date:</span>
                  <span className="font-medium">{formatDate(opportunity.schedule.endDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hours Required:</span>
                  <span className="font-medium">{opportunity.schedule.hoursRequired} hours</span>
                </div>
                {opportunity.schedule.flexible && (
                  <div className="text-sm text-gray-600 italic">
                    Schedule is flexible
                  </div>
                )}
              </div>
            </section>

            {/* Capacity */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Capacity
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Volunteers Needed:</span>
                  <span className="font-medium text-lg">
                    {opportunity.capacity.filled} / {opportunity.capacity.total}
                  </span>
                </div>
                {opportunity.capacity.minRequired > 0 && (
                  <div className="mt-2 text-sm text-gray-600">
                    Minimum required: {opportunity.capacity.minRequired}
                  </div>
                )}
              </div>
            </section>

            {/* Perks */}
            {opportunity.perks && opportunity.perks.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Perks & Benefits
                </h2>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {opportunity.perks.map((perk, index) => (
                    <li key={index}>{perk}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Deadline */}
            {opportunity.deadline && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Application Deadline
                </h2>
                <p className="text-gray-700">
                  {formatDateTime(opportunity.deadline)}
                </p>
              </section>
            )}

            {/* Apply Button */}
            {user && profileComplete && userIsVolunteer && (
              <div className="pt-6 border-t border-gray-200">
                <button
                  type="button"
                  disabled={applying || applicationSubmitted}
                  className={`w-full px-6 py-3 border border-transparent text-base font-medium rounded-md text-white ${
                    applicationSubmitted
                      ? 'bg-green-600 cursor-not-allowed'
                      : applying
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
                  onClick={handleApply}
                >
                  {applicationSubmitted
                    ? 'Application Submitted'
                    : applying
                    ? 'Applying...'
                    : 'Apply Now'}
                </button>
                {applicationError && (
                  <p className="mt-2 text-sm text-red-600">{applicationError}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

