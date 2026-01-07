/**
 * Authentication Hook
 * 
 * Provides authentication state and functions for managing user authentication
 */

'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { signIn, signUp, signOutUser } from '@/lib/firebase/auth';
import { getUserProfile, userProfileExists } from '@/lib/firebase/firestore';
import type { Volunteer, NGO, User } from '@/types/user';
import { isVolunteer, isNGO } from '@/types/user';

interface AuthState {
  user: FirebaseUser | null;
  profile: Volunteer | NGO | null;
  loading: boolean;
  profileComplete: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    profileComplete: false,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Check if profile exists
        const exists = await userProfileExists(firebaseUser.uid);
        
        if (exists) {
          // Load profile (can be Volunteer or NGO)
          const profile = await getUserProfile(firebaseUser.uid);
          setAuthState({
            user: firebaseUser,
            profile: profile as Volunteer | NGO | null,
            loading: false,
            profileComplete: !!profile,
          });
        } else {
          // User authenticated but no profile yet
          setAuthState({
            user: firebaseUser,
            profile: null,
            loading: false,
            profileComplete: false,
          });
        }
      } else {
        // User signed out
        setAuthState({
          user: null,
          profile: null,
          loading: false,
          profileComplete: false,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignUp = async (
    email: string,
    password: string,
    displayName?: string
  ) => {
    return await signUp(email, password, displayName);
  };

  const handleSignIn = async (email: string, password: string) => {
    return await signIn(email, password);
  };

  const handleSignOut = async () => {
    await signOutUser();
  };

  return {
    ...authState,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
    isVolunteer: authState.profile ? isVolunteer(authState.profile as User) : false,
    isNGO: authState.profile ? isNGO(authState.profile as User) : false,
  };
}

