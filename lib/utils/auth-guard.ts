/**
 * Authentication Guard Utilities
 * 
 * Provides utilities for role-based access control
 */

import type { User as FirebaseUser } from 'firebase/auth';
import type { User, Volunteer, NGO } from '@/types/user';
import { isVolunteer, isNGO } from '@/types/user';

/**
 * Check if user is authenticated and has a complete profile
 */
export function requireAuth(user: FirebaseUser | null, profile: Volunteer | NGO | null): boolean {
  return !!user && !!profile;
}

/**
 * Check if user is a volunteer
 */
export function requireVolunteer(
  user: FirebaseUser | null,
  profile: Volunteer | NGO | null
): profile is Volunteer {
  return !!user && !!profile && isVolunteer(profile as User);
}

/**
 * Check if user is an NGO
 */
export function requireNGO(
  user: FirebaseUser | null,
  profile: Volunteer | NGO | null
): profile is NGO {
  return !!user && !!profile && isNGO(profile as User);
}

