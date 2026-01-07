/**
 * Firestore Opportunities Utilities
 * 
 * Provides functions for creating and managing opportunities in Firestore
 */

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import type { Opportunity, OpportunityFormData } from '@/types/opportunity';

/**
 * Create a new opportunity in Firestore
 */
export async function createOpportunity(
  ngoId: string,
  ngoName: string,
  formData: OpportunityFormData
): Promise<string> {
  try {
    const opportunityRef = doc(collection(db, 'opportunities'));

    const opportunityData = {
      ngoId,
      ngoName,
      title: formData.title,
      description: formData.description,
      requirements: formData.requirements,
      skills: formData.skills,
      cause: formData.cause,
      location: {
        type: formData.location.type,
        city: formData.location.city ?? null,
        state: formData.location.state ?? null,
        address: formData.location.address ?? null,
        coordinates: null, // Can be added later with geocoding
      },
      schedule: {
        startDate: Timestamp.fromDate(formData.schedule.startDate),
        endDate: Timestamp.fromDate(formData.schedule.endDate),
        hoursRequired: formData.schedule.hoursRequired,
        flexible: formData.schedule.flexible,
        shifts: formData.schedule.shifts?.map((shift) => ({
          date: Timestamp.fromDate(shift.date),
          startTime: shift.startTime,
          endTime: shift.endTime,
        })) ?? null,
      },
      capacity: {
        total: formData.capacity.total,
        filled: 0,
        minRequired: formData.capacity.minRequired,
      },
      status: formData.status || 'draft',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      deadline: formData.deadline
        ? Timestamp.fromDate(formData.deadline)
        : null,
      stats: {
        views: 0,
        applications: 0,
        completions: 0,
      },
      images: null,
      perks: formData.perks ?? null,
      tags: formData.tags ?? null,
    };

    // Use serverTimestamp for createdAt and updatedAt
    const opportunityDoc = {
      ...opportunityData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(opportunityRef, opportunityDoc);

    return opportunityRef.id;
  } catch (error) {
    console.error('Error creating opportunity:', error);
    throw new Error('Failed to create opportunity');
  }
}

/**
 * Get an opportunity by ID
 */
export async function getOpportunity(
  opportunityId: string
): Promise<Opportunity | null> {
  try {
    const opportunityDoc = await getDoc(doc(db, 'opportunities', opportunityId));

    if (!opportunityDoc.exists()) {
      return null;
    }

    return {
      id: opportunityDoc.id,
      ...opportunityDoc.data(),
    } as Opportunity;
  } catch (error) {
    console.error('Error fetching opportunity:', error);
    throw new Error('Failed to fetch opportunity');
  }
}

/**
 * Get an opportunity by ID (alias for getOpportunity)
 */
export const getOpportunityById = getOpportunity;

/**
 * Get all opportunities for a specific NGO
 */
export async function getNGOOpportunities(
  ngoId: string
): Promise<Opportunity[]> {
  try {
    const q = query(
      collection(db, 'opportunities'),
      where('ngoId', '==', ngoId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Opportunity)
    );
  } catch (error) {
    console.error('Error fetching NGO opportunities:', error);
    throw new Error('Failed to fetch opportunities');
  }
}

/**
 * Get active opportunities (for volunteer browsing)
 * Filters by status == 'active' and deadline >= now (or no deadline)
 */
export async function getActiveOpportunities(
  limitCount: number = 20
): Promise<Opportunity[]> {
  try {
    const now = Timestamp.now();
    
    // Query opportunities where status is active
    // Note: Firestore doesn't support OR queries directly, so we'll filter deadline in memory
    // For better performance, consider creating a composite index or using two queries
    const q = query(
      collection(db, 'opportunities'),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc'),
      limit(limitCount * 2) // Fetch more to account for deadline filtering
    );

    const querySnapshot = await getDocs(q);
    
    // Filter by deadline in memory (deadline >= now or no deadline)
    const opportunities = querySnapshot.docs
      .map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Opportunity)
      )
      .filter((opp) => {
        // Include if no deadline or deadline is in the future
        if (!opp.deadline) return true;
        return opp.deadline.toMillis() >= now.toMillis();
      })
      .slice(0, limitCount); // Limit to requested count

    return opportunities;
  } catch (error) {
    console.error('Error fetching active opportunities:', error);
    throw new Error('Failed to fetch opportunities');
  }
}

/**
 * Update an opportunity
 */
export async function updateOpportunity(
  opportunityId: string,
  updates: Partial<OpportunityFormData>
): Promise<void> {
  try {
    const opportunityRef = doc(db, 'opportunities', opportunityId);

    const updateData: Partial<Opportunity> = {
      updatedAt: Timestamp.now(),
    };

    if (updates.title) updateData.title = updates.title;
    if (updates.description) updateData.description = updates.description;
    if (updates.requirements) updateData.requirements = updates.requirements;
    if (updates.skills) updateData.skills = updates.skills;
    if (updates.cause) updateData.cause = updates.cause;
    if (updates.status) updateData.status = updates.status;
    if (updates.perks) updateData.perks = updates.perks;
    if (updates.tags) updateData.tags = updates.tags;

    if (updates.location) {
      updateData.location = {
        type: updates.location.type,
        city: updates.location.city ?? null,
        state: updates.location.state ?? null,
        address: updates.location.address ?? null,
        coordinates: null,
      };
    }

    if (updates.schedule) {
      updateData.schedule = {
        startDate: Timestamp.fromDate(updates.schedule.startDate),
        endDate: Timestamp.fromDate(updates.schedule.endDate),
        hoursRequired: updates.schedule.hoursRequired,
        flexible: updates.schedule.flexible,
        shifts: updates.schedule.shifts?.map((shift) => ({
          date: Timestamp.fromDate(shift.date),
          startTime: shift.startTime,
          endTime: shift.endTime,
        })) ?? null,
      };
    }

    if (updates.capacity) {
      updateData.capacity = {
        ...updates.capacity,
        filled: 0, // Don't update filled count here
      };
    }

    if (updates.deadline) {
      updateData.deadline = Timestamp.fromDate(updates.deadline);
    }

    await setDoc(opportunityRef, updateData, { merge: true });
  } catch (error) {
    console.error('Error updating opportunity:', error);
    throw new Error('Failed to update opportunity');
  }
}

