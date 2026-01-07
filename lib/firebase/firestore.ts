/**
 * Firestore Database Utilities
 * 
 * Provides functions for creating and managing user profiles in Firestore
 */

import {
  doc,
  setDoc,
  getDoc,
  Timestamp,
  GeoPoint,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import type {
  Volunteer,
  VolunteerProfileFormData,
  NGO,
  NGOProfileFormData,
  User,
} from '@/types/user';

/**
 * Create a volunteer profile in Firestore
 */
export async function createVolunteerProfile(
  userId: string,
  formData: VolunteerProfileFormData
): Promise<void> {
  try {
   const volunteerData: Omit<Volunteer, 'id'> = {
  type: 'volunteer',
  email: formData.email,
  name: formData.name,
  phone: formData.phone ?? null,
  avatar: null,
  createdAt: Timestamp.now(),
  lastActive: Timestamp.now(),
  verified: false,
  location: {
    city: formData.location.city,
    state: formData.location.state,
    coordinates: null,
    remote: formData.location.remote,
  },
  skills: formData.skills,
  causes: formData.causes,
  availability: {
    hoursPerWeek: formData.availability.hoursPerWeek,
    preferredDays: formData.availability.preferredDays,
    preferredTime: formData.availability.preferredTime,
  },
  commitment: formData.commitment,
  experience: formData.experience ?? null,
  bio: formData.bio ?? null,
  stats: {
    totalHours: 0,
    eventsAttended: 0,
    eventsCompleted: 0,
    badges: [],
    currentStreak: 0,
    longestStreak: 0,
  },
  preferences: {
    preferredNGOs: [],
    interactionHistory: [],
  },
};


    // Use serverTimestamp for createdAt and lastActive
    const volunteerDoc = {
      ...volunteerData,
      createdAt: serverTimestamp(),
      lastActive: serverTimestamp(),
    };

    await setDoc(doc(db, 'users', userId), volunteerDoc);
  } catch (error) {
    console.error('Error creating volunteer profile:', error);
    throw new Error('Failed to create volunteer profile');
  }
}

/**
 * Get a user profile from Firestore
 * Returns Volunteer or NGO based on user type
 */
export async function getUserProfile(
  userId: string
): Promise<Volunteer | NGO | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      return null;
    }

    const userData = userDoc.data();
    const { id: _, ...userDataWithoutId } = userData as User & { id?: string };
    return {
      ...userDataWithoutId,
      id: userDoc.id,
    } as Volunteer | NGO;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile');
  }
}

/**
 * Check if a user profile exists
 */
export async function userProfileExists(userId: string): Promise<boolean> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists();
  } catch (error) {
    console.error('Error checking user profile:', error);
    return false;
  }
}


