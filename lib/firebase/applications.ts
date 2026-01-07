/**
 * Firestore Applications Utilities
 *
 * Provides functions for creating and managing applications in Firestore
 */

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  Timestamp,
  addDoc,
  updateDoc,
  orderBy,
} from 'firebase/firestore';
import { db } from './config';
import type { Application, MatchBreakdown, ApplicationStatus } from '@/types/application';
import type { Volunteer } from '@/types/user';
import type { Opportunity } from '@/types/opportunity';

/**
 * Application with volunteer information
 */
export interface ApplicationWithVolunteer extends Application {
  volunteer: {
    name: string;
    city: string;
    skills: string[];
    avatar?: string;
  };
}

/**
 * Application with opportunity information
 */
export interface ApplicationWithOpportunity extends Application {
  opportunity: Opportunity;
}

/**
 * Create a new application in Firestore
 */
export async function createApplication(params: {
  volunteerId: string;
  opportunityId: string;
  ngoId: string;
  matchScore: number;
}): Promise<Application> {
  try {
    // Check for existing application
    const existingApplication = await getExistingApplication(
      params.volunteerId,
      params.opportunityId
    );

    if (existingApplication) {
      return existingApplication;
    }

    // Create new application using addDoc
    const applicationData = {
      opportunityId: params.opportunityId,
      ngoId: params.ngoId,
      volunteerId: params.volunteerId,
      status: 'applied' as const,
      matchScore: params.matchScore,
      appliedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'applications'), applicationData);

    // Return the created application
    return {
      id: docRef.id,
      ...applicationData,
      appliedAt: Timestamp.now(), // For immediate return
    } as Application;
  } catch (error) {
    console.error('Error creating application:', error);
    throw new Error('Failed to create application');
  }
}

/**
 * Get application count for an opportunity
 */
export async function getApplicationCount(opportunityId: string): Promise<number> {
  try {
    const q = query(
      collection(db, 'applications'),
      where('opportunityId', '==', opportunityId)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting application count:', error);
    return 0;
  }
}

/**
 * Get existing application for a volunteer-opportunity pair
 */
async function getExistingApplication(
  volunteerId: string,
  opportunityId: string
): Promise<Application | null> {
  try {
    const q = query(
      collection(db, 'applications'),
      where('volunteerId', '==', volunteerId),
      where('opportunityId', '==', opportunityId)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    // Return the first (should be only) application
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    } as Application;
  } catch (error) {
    console.error('Error checking existing application:', error);
    throw new Error('Failed to check existing application');
  }
}

/**
 * Get all applications for an opportunity with volunteer information
 */
export async function getApplicationsForOpportunity(
  opportunityId: string
): Promise<ApplicationWithVolunteer[]> {
  try {
    const q = query(
      collection(db, 'applications'),
      where('opportunityId', '==', opportunityId),
      orderBy('appliedAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const applications: ApplicationWithVolunteer[] = [];

    for (const appDoc of querySnapshot.docs) {
      const application = {
        id: appDoc.id,
        ...appDoc.data(),
      } as Application;

      // Load volunteer information
      const volunteerDoc = await getDoc(doc(db, 'users', application.volunteerId));
      if (volunteerDoc.exists()) {
        const volunteerData = volunteerDoc.data() as Volunteer;
        applications.push({
          ...application,
          volunteer: {
            name: volunteerData.name,
            city: volunteerData.location?.city || '',
            skills: volunteerData.skills || [],
            avatar: volunteerData.avatar || undefined,
          },
        });
      }
    }

    return applications;
  } catch (error) {
    console.error('Error getting applications for opportunity:', error);
    throw new Error('Failed to load applications');
  }
}

/**
 * Update application status with appropriate timestamp
 */
export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus
): Promise<void> {
  try {
    const updateData: any = { status };

    // Set appropriate timestamp based on status
    if (status === 'shortlisted') {
      updateData.shortlistedAt = serverTimestamp();
    } else if (status === 'confirmed') {
      updateData.confirmedAt = serverTimestamp();
    } else if (status === 'completed') {
      updateData.completedAt = serverTimestamp();
    }

    await updateDoc(doc(db, 'applications', applicationId), updateData);
  } catch (error) {
    console.error('Error updating application status:', error);
    throw new Error('Failed to update application status');
  }
}

/**
 * Get applications for a volunteer with opportunity information
 */
export async function getApplicationsForVolunteer(volunteerId: string): Promise<ApplicationWithOpportunity[]> {
  try {
    const q = query(
      collection(db, 'applications'),
      where('volunteerId', '==', volunteerId),
      where('status', '!=', 'withdrawn'),
      orderBy('status'),
      orderBy('appliedAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const applications: ApplicationWithOpportunity[] = [];

    for (const appDoc of querySnapshot.docs) {
      const application = {
        id: appDoc.id,
        ...appDoc.data(),
      } as Application;

      // Load opportunity information
      const opportunityDoc = await getDoc(doc(db, 'opportunities', application.opportunityId));
      if (opportunityDoc.exists()) {
        const opportunityData = opportunityDoc.data();
        applications.push({
          ...application,
          opportunity: {
            id: opportunityDoc.id,
            ...opportunityData,
          } as Opportunity,
        });
      }
    }

    return applications;
  } catch (error) {
    console.error('Error getting applications for volunteer:', error);
    throw new Error('Failed to load applications');
  }
}