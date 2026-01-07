'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { logout } from '@/lib/firebase/auth';
import { useAuth } from '@/lib/hooks/useAuth';

export default function Navbar() {
  const router = useRouter();
  const { user, profile, loading, isVolunteer, isNGO } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignOut = async () => {
    setError(null);
    setIsSigningOut(true);

    try {
      await logout();
      router.push('/auth/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign out');
      console.error('Sign out error:', err);
    } finally {
      setIsSigningOut(false);
    }
  };

  // Don't render navbar if no user is authenticated or still loading
  if (!user || loading) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-semibold text-gray-900">
              VolunteerHub
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isNGO && (
              <Link
                href="/ngo/dashboard"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                NGO Dashboard
              </Link>
            )}
            {isVolunteer && (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Volunteer Dashboard
                </Link>
                <Link
                  href="/volunteer/opportunities"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Find Opportunities
                </Link>
              </>
            )}
            {profile && (
              <span className="text-sm text-gray-700">
                Welcome, {profile.name}
              </span>
            )}

            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSigningOut ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}