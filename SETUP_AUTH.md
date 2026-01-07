# Authentication & Volunteer Profile Setup

## ✅ What's Been Implemented

### 1. Type Definitions (`types/user.ts`)
- `User` interface (base user type)
- `Volunteer` interface (extends User with volunteer-specific fields)
- `VolunteerProfileFormData` interface (for form submission)
- Type guards and helper types

### 2. Firebase Configuration (`lib/firebase/config.ts`)
- Firebase app initialization
- Auth, Firestore, Storage, and Analytics instances
- Environment variable validation

### 3. Authentication Utilities (`lib/firebase/auth.ts`)
- `signUp()` - Create new user account
- `signIn()` - Sign in existing user
- `signOutUser()` - Sign out current user
- Error handling with user-friendly messages

### 4. Firestore Utilities (`lib/firebase/firestore.ts`)
- `createVolunteerProfile()` - Create volunteer profile in Firestore
- `getUserProfile()` - Fetch user profile
- `userProfileExists()` - Check if profile exists

### 5. Auth Hook (`lib/hooks/useAuth.ts`)
- `useAuth()` hook for managing authentication state
- Tracks user, profile, loading state, and profile completion status
- Provides signUp, signIn, signOut functions

### 6. Pages Created
- **Home Page** (`app/page.tsx`) - Landing page with redirects
- **Login Page** (`app/auth/login/page.tsx`) - Email/password sign in
- **Signup Page** (`app/auth/signup/page.tsx`) - Create new account
- **Volunteer Onboarding** (`app/onboarding/volunteer/page.tsx`) - Complete volunteer profile
- **Dashboard** (`app/dashboard/page.tsx`) - User dashboard (protected)

## 📋 Next Steps

### 1. Install Firebase SDK
```bash
npm install firebase
```

### 2. Set Up Environment Variables
Create a `.env.local` file in the root directory with your Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 3. Set Up Firestore Security Rules
Create `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
      allow delete: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 4. Enable Email/Password Authentication
In Firebase Console:
1. Go to Authentication > Sign-in method
2. Enable "Email/Password" provider
3. Save changes

### 5. Create Firestore Collection
The `users` collection will be created automatically when the first profile is created.

## 🎯 Features Implemented

### Authentication Flow
1. User signs up with email/password
2. Redirected to volunteer onboarding
3. Completes profile with all required fields
4. Redirected to dashboard

### Profile Fields
- Basic Info: Name, Email, Phone
- Location: City, State, Remote preference
- Skills: Multi-select from predefined list
- Causes: Multi-select from predefined list
- Availability: Hours/week, Preferred days, Preferred time
- Commitment: One-time, Short-term, Long-term
- Additional: Experience, Bio

### Data Structure
All volunteer data follows the schema from `PROJECT_PROMPT.md`:
- User base fields (id, type, email, name, etc.)
- Location with city, state, remote flag
- Skills and causes arrays
- Availability preferences
- Stats (initialized to 0)
- Preferences (empty arrays initially)

## 🔒 Security Notes

- All authentication is handled client-side using Firebase Auth
- Firestore security rules should be configured to protect user data
- Profile creation requires authenticated user
- User can only create/update their own profile

## 🐛 Known Issues

- Firebase SDK needs to be installed (linting errors will resolve)
- Firestore security rules need to be deployed
- Email verification not yet implemented
- Password reset not yet implemented

## 📝 Testing Checklist

- [ ] Install Firebase SDK
- [ ] Configure environment variables
- [ ] Set up Firebase project
- [ ] Enable Email/Password auth
- [ ] Deploy Firestore security rules
- [ ] Test signup flow
- [ ] Test login flow
- [ ] Test profile creation
- [ ] Test dashboard access
- [ ] Test protected routes


