import { Timestamp, GeoPoint } from 'firebase/firestore';

/**
 * Application status
 */
export type ApplicationStatus =
  | 'applied'
  | 'shortlisted'
  | 'confirmed'
  | 'completed'
  | 'rejected'
  | 'withdrawn';

/**
 * Match breakdown for application scoring
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
 * Check-in/check-out data
 */
export interface CheckInOut {
  timestamp: Timestamp;
  location?: GeoPoint;
}

/**
 * Check-out specific data
 */
export interface CheckOut extends CheckInOut {
  hoursCompleted: number;
}

/**
 * Application interface
 * Represents a volunteer's application to an opportunity
 */
export interface Application {
  id: string;
  opportunityId: string;
  volunteerId: string;
  ngoId: string;

  // Application details
  status: ApplicationStatus;
  matchScore: number; // 0-100
  matchBreakdown: MatchBreakdown;

  // Timeline
  appliedAt: Timestamp;
  shortlistedAt?: Timestamp;
  confirmedAt?: Timestamp;
  completedAt?: Timestamp;

  // Communication
  volunteerMessage?: string;
  ngoNotes?: string;

  // Attendance
  checkIn?: CheckInOut;
  checkOut?: CheckOut;
}