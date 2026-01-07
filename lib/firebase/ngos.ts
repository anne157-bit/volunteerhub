/**
 * Firestore NGO Utilities
 * 
 * Provides functions for creating and managing NGO profiles in Firestore
 */

import { doc, setDoc, Timestamp, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import type { NGO, NGOProfileFormData } from '@/types/user';

/**
 * Create an NGO profile in Firestore
 */
export async function createNGOProfile(
  userId: string,
  formData: NGOProfileFormData
): Promise<void> {
  try {
    const ngoData: Omit<NGO, 'id'> = {
      type: 'ngo',
      email: formData.email,
      name: formData.name,
      phone: formData.phone ?? null,
      avatar: null,
      createdAt: Timestamp.now(),
      lastActive: Timestamp.now(),
      verified: false,
      organizationName: formData.organizationName,
      description: formData.description,
      impactAreas: formData.impactAreas,
      website: formData.website ?? null,
      registrationNumber: formData.registrationNumber ?? null,
      foundedYear: formData.foundedYear ?? null,
      location: {
        city: formData.location.city,
        state: formData.location.state,
        address: formData.location.address ?? null,
      },
      verification: {
        status: 'pending',
        documents: null,
        verifiedAt: null,
      },
      stats: {
        totalOpportunities: 0,
        totalVolunteers: 0,
        totalHours: 0,
        avgRating: 0,
        fillRate: 0,
      },
      socialMedia: formData.socialMedia ?? null,
    };

    // Use serverTimestamp for createdAt and lastActive
    const ngoDoc = {
      ...ngoData,
      createdAt: serverTimestamp(),
      lastActive: serverTimestamp(),
    };

    await setDoc(doc(db, 'users', userId), ngoDoc);
  } catch (error) {
    console.error('Error creating NGO profile:', error);
    throw new Error('Failed to create NGO profile');
  }
}

