/**
 * Firebase Authentication Utilities
 * 
 * Provides functions for user authentication: sign up, sign in, sign out
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser,
  AuthError,
} from 'firebase/auth';
import { auth } from './config';

/**
 * Sign up a new user with email and password
 */
export async function signUp(
  email: string,
  password: string,
  displayName?: string
): Promise<FirebaseUser> {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Update display name if provided
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName,
      });
    }

    return userCredential.user;
} catch (error) {
  // Handle Firebase auth errors
  if ((error as AuthError)?.code) {
    throw mapAuthError(error as AuthError);
  }
  throw new Error('Failed to create account');
}
}

/**
 * Sign in an existing user with email and password
 */
export async function signIn(
  email: string,
  password: string
): Promise<FirebaseUser> {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    if ((error as AuthError)?.code) {
    throw mapAuthError(error as AuthError);
    }
    throw new Error('Failed to sign in');
  }
}

/**
 * Sign out the current user
 */
export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw new Error('Failed to sign out');
  }
}

/**
 * Logout helper - strongly typed sign out function
 */
export async function logout(): Promise<void> {
  try {
    const authInstance = auth;
    await signOut(authInstance);
  } catch (error) {
    console.error('Error signing out:', error);
    throw new Error('Failed to sign out');
  }
}

/**
 * Map Firebase auth error codes to user-friendly messages
 */
function mapAuthError(error: AuthError): Error {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return new Error('An account with this email already exists');
    case 'auth/invalid-email':
      return new Error('Invalid email address');
    case 'auth/operation-not-allowed':
      return new Error('Email/password accounts are not enabled');
    case 'auth/weak-password':
      return new Error('Password should be at least 6 characters');
    case 'auth/user-disabled':
      return new Error('This account has been disabled');
    case 'auth/user-not-found':
      return new Error('No account found with this email');
    case 'auth/wrong-password':
      return new Error('Incorrect password');
    case 'auth/too-many-requests':
      return new Error('Too many attempts. Please try again later');
    case 'auth/network-request-failed':
      return new Error('Network error. Please check your connection');
    default:
      return new Error(error.message || 'Authentication failed');
  }
}


