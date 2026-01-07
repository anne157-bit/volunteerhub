/**
 * Matching Algorithm Utilities
 * 
 * Calculates match scores between volunteers and opportunities
 */

import type { Volunteer } from '@/types/user';
import type { Opportunity, OpportunitySkill } from '@/types/opportunity';
import { GeoPoint } from 'firebase/firestore';

/**
 * Match score breakdown
 */
export interface MatchBreakdown {
  skills: number;
  availability: number;
  location: number;
  cause: number;
  commitment: number;
  personalization: number;
}

/**
 * Match score result
 */
export interface MatchScoreResult {
  totalScore: number;
  breakdown: MatchBreakdown;
  recommendations: string[];
}

/**
 * Calculate match score between volunteer and opportunity
 * Returns: 0-100 score with detailed breakdown
 */
export function calculateMatchScore(
  volunteer: Volunteer,
  opportunity: Opportunity
): MatchScoreResult {
  // Layer 1: Skills Matching (0-40 points)
  const skillScore = calculateSkillScore(volunteer.skills, opportunity.skills);

  // Layer 2: Availability Matching (0-20 points)
  const availScore = calculateAvailabilityScore(
    volunteer.availability,
    opportunity.schedule
  );

  // Layer 3: Location/Distance (0-15 points)
  const locationScore = calculateLocationScore(
    volunteer.location,
    opportunity.location
  );

  // Layer 4: Cause Alignment (0-10 points)
  const causeScore = calculateCauseScore(volunteer.causes, opportunity.cause);

  // Layer 5: Experience & Commitment (0-10 points)
  const commitmentScore = calculateCommitmentScore(
    volunteer.commitment,
    opportunity.schedule
  );

  // Layer 6: ML-based Personalization (0-5 bonus points)
  const mlScore = calculateMLScore(volunteer, opportunity);

  const totalScore = Math.min(
    100,
    skillScore + availScore + locationScore + causeScore + commitmentScore + mlScore
  );

  return {
    totalScore: Math.round(totalScore),
    breakdown: {
      skills: skillScore,
      availability: availScore,
      location: locationScore,
      cause: causeScore,
      commitment: commitmentScore,
      personalization: mlScore,
    },
    recommendations: generateRecommendations(totalScore, {
      skills: skillScore,
      availability: availScore,
      location: locationScore,
      cause: causeScore,
      commitment: commitmentScore,
      personalization: mlScore,
    }),
  };
}

/**
 * Skill matching with importance weighting
 */
function calculateSkillScore(
  volunteerSkills: string[] | undefined,
  opportunitySkills: OpportunitySkill[]
): number {
  if (opportunitySkills.length === 0) return 40; // No skills required
  
  // If volunteer has no skills, return 0
  if (!volunteerSkills || volunteerSkills.length === 0) return 0;

  let score = 0;
  let maxScore = 0;

  opportunitySkills.forEach((reqSkill) => {
    const weight = {
      required: 15,
      preferred: 8,
      bonus: 5,
    }[reqSkill.importance];

    maxScore += weight;

    if (
      volunteerSkills.some(
        (vs) => vs.toLowerCase() === reqSkill.name.toLowerCase()
      )
    ) {
      score += weight;
    }
  });

  // Normalize to 0-40 range
  return maxScore > 0 ? (score / maxScore) * 40 : 0;
}

/**
 * Availability matching
 */
function calculateAvailabilityScore(
  volunteerAvail: Volunteer['availability'],
  oppSchedule: Opportunity['schedule']
): number {
  const hoursNeeded = oppSchedule.hoursRequired;
  const hoursAvailable = volunteerAvail?.hoursPerWeek;

  // If availability is not set, return low score
  if (!hoursAvailable || hoursAvailable === 0) return 5;

  if (hoursAvailable >= hoursNeeded) return 20;
  if (hoursAvailable >= hoursNeeded * 0.75) return 15;
  if (hoursAvailable >= hoursNeeded * 0.5) return 10;
  return 5;
}

/**
 * Location/distance calculation
 */
function calculateLocationScore(
  volunteerLoc: Volunteer['location'],
  oppLoc: Opportunity['location']
): number {
  // Remote opportunities get full score
  if (oppLoc.type === 'remote' || volunteerLoc.remote) return 15;

  // Same city gets high score
  if (oppLoc.city && volunteerLoc.city === oppLoc.city) return 15;

  // Same state gets medium score
  if (oppLoc.state && volunteerLoc.state === oppLoc.state) return 10;

  // Calculate distance if coordinates available
  if (volunteerLoc.coordinates && oppLoc.coordinates) {
    const distance = calculateDistance(
      volunteerLoc.coordinates,
      oppLoc.coordinates
    );

    if (distance < 5) return 15; // Within 5km
    if (distance < 15) return 12; // Within 15km
    if (distance < 30) return 8; // Within 30km
    return 5;
  }

  return 5; // Different location
}

/**
 * Cause alignment
 */
function calculateCauseScore(
  volunteerCauses: string[] | undefined,
  opportunityCause: string
): number {
  if (!volunteerCauses || volunteerCauses.length === 0) return 5;
  return volunteerCauses.includes(opportunityCause) ? 10 : 5;
}

/**
 * Commitment level matching
 */
function calculateCommitmentScore(
  volunteerCommitment: string | null | undefined,
  oppSchedule: Opportunity['schedule']
): number {
  // If commitment is not set, return low score
  if (!volunteerCommitment) return 5;

  const duration =
    (oppSchedule.endDate.toMillis() - oppSchedule.startDate.toMillis()) /
    (1000 * 60 * 60 * 24); // days

  if (volunteerCommitment === 'Long-term' && duration > 180) return 10;
  if (volunteerCommitment === 'Short-term' && duration <= 90) return 10;
  if (volunteerCommitment === 'One-time' && duration <= 7) return 10;

  return 5;
}

/**
 * ML-based personalization (simple collaborative filtering)
 */
function calculateMLScore(
  volunteer: Volunteer,
  opportunity: Opportunity
): number {
  // Check if volunteer has interacted with similar opportunities
  const similarInteractions = volunteer.preferences.interactionHistory.filter(
    (h) => h.action === 'completed' || h.action === 'applied'
  );

  // Boost score for similar NGOs or causes
  const hasWorkedWithNGO = volunteer.preferences.preferredNGOs.includes(
    opportunity.ngoId
  );

  if (hasWorkedWithNGO) return 5;
  if (similarInteractions.length > 3) return 3;
  return 0;
}

/**
 * Generate personalized recommendations
 */
function generateRecommendations(
  score: number,
  breakdown: MatchBreakdown
): string[] {
  const recommendations: string[] = [];

  if (score >= 85) {
    recommendations.push(
      '🌟 Perfect match! This opportunity aligns excellently with your profile.'
    );
  } else if (score >= 70) {
    recommendations.push('✅ Great match! Highly recommended for you.');
  }

  if (breakdown.skills < 20) {
    recommendations.push(
      '💡 Consider developing skills to improve match.'
    );
  }

  if (breakdown.availability < 15) {
    recommendations.push(
      '⏰ This opportunity requires more time than you typically have available.'
    );
  }

  return recommendations;
}

/**
 * Haversine formula for distance calculation
 */
function calculateDistance(
  coord1: GeoPoint,
  coord2: GeoPoint
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(coord2.latitude - coord1.latitude);
  const dLon = toRad(coord2.longitude - coord1.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.latitude)) *
      Math.cos(toRad(coord2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Get match label from score
 */
export function getMatchLabel(score: number): 'High' | 'Medium' | 'Low' {
  if (score >= 70) return 'High';
  if (score >= 40) return 'Medium';
  return 'Low';
}

