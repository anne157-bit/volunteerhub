import { Timestamp, GeoPoint } from 'firebase/firestore';

/**
 * Opportunity skill requirement
 */
export interface OpportunitySkill {
  name: string;
  importance: 'required' | 'preferred' | 'bonus';
}

/**
 * Opportunity location
 */
export interface OpportunityLocation {
  type: 'remote' | 'on-site' | 'hybrid';
  city?: string | null;
  state?: string | null;
  address?: string | null;
  coordinates?: GeoPoint | null;
}

/**
 * Opportunity shift schedule
 */
export interface OpportunityShift {
  date: Timestamp;
  startTime: string;
  endTime: string;
}

/**
 * Opportunity schedule
 */
export interface OpportunitySchedule {
  startDate: Timestamp;
  endDate: Timestamp;
  hoursRequired: number;
  flexible: boolean;
  shifts?: OpportunityShift[] | null;
}

/**
 * Opportunity capacity
 */
export interface OpportunityCapacity {
  total: number;
  filled: number;
  minRequired: number;
}

/**
 * Opportunity statistics
 */
export interface OpportunityStats {
  views: number;
  applications: number;
  completions: number;
  avgRating?: number | null;
}

/**
 * Opportunity status
 */
export type OpportunityStatus =
  | 'draft'
  | 'active'
  | 'filled'
  | 'completed'
  | 'cancelled';

/**
 * Opportunity interface
 * Represents a volunteer opportunity posted by an NGO
 */
export interface Opportunity {
  id: string;
  ngoId: string;
  ngoName: string;

  // Basic info
  title: string;
  description: string;
  requirements: string;

  // Skills and matching
  skills: OpportunitySkill[];
  cause: string; // Main impact area

  // Location
  location: OpportunityLocation;

  // Time commitment
  schedule: OpportunitySchedule;

  // Capacity
  capacity: OpportunityCapacity;

  // Status
  status: OpportunityStatus;

  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deadline?: Timestamp | null;

  // Engagement
  stats: OpportunityStats;

  // Optional
  images?: string[] | null;
  perks?: string[] | null; // ["Certificate", "Meals provided", "Transportation"]
  tags?: string[] | null;
}

/**
 * Opportunity creation form data
 * Used when creating a new opportunity
 */
export interface OpportunityFormData {
  title: string;
  description: string;
  requirements: string;
  skills: OpportunitySkill[];
  cause: string;
  location: {
    type: 'remote' | 'on-site' | 'hybrid';
    city?: string;
    state?: string;
    address?: string;
  };
  schedule: {
    startDate: Date;
    endDate: Date;
    hoursRequired: number;
    flexible: boolean;
    shifts?: Array<{
      date: Date;
      startTime: string;
      endTime: string;
    }>;
  };
  capacity: {
    total: number;
    minRequired: number;
  };
  deadline?: Date;
  perks?: string[];
  tags?: string[];
  status?: OpportunityStatus;
}

