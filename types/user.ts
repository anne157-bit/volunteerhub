import { Timestamp, GeoPoint } from 'firebase/firestore';

/**
 * Base User interface
 * Shared between volunteers and NGOs
 */
export interface User {
  id: string;
  type: 'volunteer' | 'ngo';
  email: string;
  name: string;
  phone?: string | null;
  avatar?: string | null;
  createdAt: Timestamp;
  lastActive: Timestamp;
  verified: boolean;
}

/**
 * Volunteer location information
 */
export interface VolunteerLocation {
  city: string;
  state: string;
  coordinates?: GeoPoint | null;
  remote: boolean;
}

/**
 * Volunteer availability preferences
 */
export interface VolunteerAvailability {
  hoursPerWeek?: number | null;
  preferredDays?: string[]; // ["Monday", "Weekend"]
  preferredTime?: string; // "Morning", "Evening", "Flexible"
}

/**
 * Volunteer statistics
 */
export interface VolunteerStats {
  totalHours: number;
  eventsAttended: number;
  eventsCompleted?: number;
  badges: string[];
  currentStreak: number;
  longestStreak: number;
}

/**
 * Volunteer interaction history entry
 */
export interface InteractionHistory {
  opportunityId: string;
  action: 'viewed' | 'applied' | 'completed';
  timestamp: Timestamp;
}

/**
 * Volunteer preferences
 */
export interface VolunteerPreferences {
  preferredNGOs: string[];
  interactionHistory: InteractionHistory[];
}

/**
 * Volunteer profile interface
 * Extends the base User interface with volunteer-specific fields
 */
export interface Volunteer extends User {
  location: VolunteerLocation;
  skills?: string[]; // ["Teaching", "Coding", "Design"]
  causes?: string[]; // ["Education", "Environment", "Health"]
  availability?: VolunteerAvailability;
  commitment?: 'One-time' | 'Short-term' | 'Long-term' | null;
  experience?: string | null;
  bio?: string | null;
  stats: VolunteerStats;
  preferences: VolunteerPreferences;
}

/**
 * Type guard to check if a user is a volunteer
 */
export function isVolunteer(user: User): user is Volunteer {
  return user.type === 'volunteer';
}

/**
 * Volunteer profile creation form data
 * Used when creating a new volunteer profile
 */
export interface VolunteerProfileFormData {
  name: string;
  email: string;
  phone?: string;
  location: {
    city: string;
    state: string;
    remote: boolean;
  };
  skills: string[];
  causes: string[];
  availability: {
    hoursPerWeek: number;
    preferredDays: string[];
    preferredTime: string;
  };
  commitment: 'One-time' | 'Short-term' | 'Long-term';
  experience?: string;
  bio?: string;
}

/**
 * NGO location information
 */
export interface NGOLocation {
  city: string;
  state: string;
  address?: string | null;
}

/**
 * NGO verification status
 */
export interface NGOVerification {
  status: 'pending' | 'verified' | 'rejected';
  documents?: string[] | null;
  verifiedAt?: Timestamp | null;
}

/**
 * NGO statistics
 */
export interface NGOStats {
  totalOpportunities: number;
  totalVolunteers: number;
  totalHours: number;
  avgRating: number;
  fillRate: number;
  eventsCompleted?: number;
  currentStreak?: number;
}

/**
 * NGO social media links
 */
export interface NGOSocialMedia {
  website?: string;
  linkedin?: string;
  instagram?: string;
  facebook?: string;
}

/**
 * NGO profile interface
 * Extends the base User interface with NGO-specific fields
 */
export interface NGO extends User {
  organizationName: string;
  description: string;
  impactAreas: string[];
  website?: string | null;
  registrationNumber?: string | null;
  foundedYear?: number | null;
  location: NGOLocation;
  verification: NGOVerification;
  stats: NGOStats;
  socialMedia?: NGOSocialMedia | null;
  skills?: string[];
  causes?: string[];
  availability?: VolunteerAvailability;
  commitment?: 'One-time' | 'Short-term' | 'Long-term' | null;
}

/**
 * Type guard to check if a user is an NGO
 */
export function isNGO(user: User): user is NGO {
  return user.type === 'ngo';
}

/**
 * NGO profile creation form data
 * Used when creating a new NGO profile
 */
export interface NGOProfileFormData {
  name: string;
  email: string;
  phone?: string;
  organizationName: string;
  description: string;
  impactAreas: string[];
  website?: string;
  registrationNumber?: string;
  foundedYear?: number;
  location: {
    city: string;
    state: string;
    address?: string;
  };
  socialMedia?: {
    website?: string;
    linkedin?: string;
    instagram?: string;
    facebook?: string;
  };
}


