/**
 * Firebase Configuration
 * 
 * This file initializes Firebase services using environment variables.
 * All Firebase config values should be stored in .env.local
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, Analytics } from 'firebase/analytics';

/**
 * Firebase configuration object
 * All values are read from environment variables prefixed with NEXT_PUBLIC_
 * to make them available in the browser
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/**
 * Validate that all required Firebase config values are present
 */
function validateFirebaseConfig(): void {
  const requiredFields: (keyof typeof firebaseConfig)[] = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
  ];

  const missingFields = requiredFields.filter(
    (field) => !firebaseConfig[field]
  );

  if (missingFields.length > 0) {
    throw new Error(
      `Missing required Firebase environment variables: ${missingFields.join(', ')}\n` +
        'Please check your .env.local file and ensure all NEXT_PUBLIC_FIREBASE_* variables are set.'
    );
  }
}

// Validate config before initialization
validateFirebaseConfig();

/**
 * Initialize Firebase App
 * Uses singleton pattern to prevent multiple initializations
 */
let app: FirebaseApp;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

/**
 * Firebase Authentication instance
 * Used for user sign-in, sign-up, and authentication state management
 */
export const auth: Auth = getAuth(app);

/**
 * Firestore database instance
 * Used for storing and retrieving application data (users, opportunities, applications, etc.)
 */
export const db: Firestore = getFirestore(app);

/**
 * Firebase Storage instance
 * Used for storing user-uploaded files (avatars, NGO logos, opportunity images, etc.)
 */
export const storage: FirebaseStorage = getStorage(app);

/**
 * Firebase Analytics instance (client-side only)
 * Used for tracking user events and app performance metrics
 * Only initialized in browser environment
 */
export const analytics: Analytics | null =
  typeof window !== 'undefined' && firebaseConfig.measurementId
    ? getAnalytics(app)
    : null;

/**
 * Default export of the Firebase app instance
 * Useful for advanced use cases or when you need direct access to the app
 */
export default app;


