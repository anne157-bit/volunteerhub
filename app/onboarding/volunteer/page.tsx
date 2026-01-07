'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { createVolunteerProfile } from '@/lib/firebase/firestore';
import type { VolunteerProfileFormData } from '@/types/user';

const SKILLS_OPTIONS = [
  'Teaching',
  'Coding',
  'Design',
  'Writing',
  'Marketing',
  'Photography',
  'Video Editing',
  'Event Planning',
  'Fundraising',
  'Translation',
  'Legal',
  'Medical',
  'Counseling',
  'Childcare',
  'Elderly Care',
];

const CAUSES_OPTIONS = [
  'Education',
  'Environment',
  'Health',
  'Poverty',
  'Human Rights',
  'Animal Welfare',
  'Arts & Culture',
  'Disaster Relief',
  'Community Development',
  'Technology',
];

const DAYS_OPTIONS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
  'Weekend',
  'Weekday',
];

const TIME_OPTIONS = ['Morning', 'Afternoon', 'Evening', 'Flexible'];

const COMMITMENT_OPTIONS: Array<'One-time' | 'Short-term' | 'Long-term'> = [
  'One-time',
  'Short-term',
  'Long-term',
];

export default function VolunteerOnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<VolunteerProfileFormData>({
    name: '',
    email: '',
    phone: '',
    location: {
      city: '',
      state: '',
      remote: false,
    },
    skills: [],
    causes: [],
    availability: {
      hoursPerWeek: 0,
      preferredDays: [],
      preferredTime: 'Flexible',
    },
    commitment: 'Short-term',
    experience: '',
    bio: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    } else if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || '',
        name: user.displayName || '',
      }));
    }
  }, [user, authLoading, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof VolunteerProfileFormData] as object),
          [child]: type === 'checkbox' ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleArrayToggle = (
    field: 'skills' | 'causes' | 'availability.preferredDays',
    value: string
  ) => {
    if (field === 'availability.preferredDays') {
      setFormData((prev) => ({
        ...prev,
        availability: {
          ...prev.availability,
          preferredDays: prev.availability.preferredDays.includes(value)
            ? prev.availability.preferredDays.filter((d) => d !== value)
            : [...prev.availability.preferredDays, value],
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: prev[field].includes(value)
          ? prev[field].filter((item) => item !== value)
          : [...prev[field], value],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name || !formData.email) {
      setError('Name and email are required');
      return;
    }

    if (!formData.location.city || !formData.location.state) {
      setError('City and state are required');
      return;
    }

    if (formData.skills.length === 0) {
      setError('Please select at least one skill');
      return;
    }

    if (formData.causes.length === 0) {
      setError('Please select at least one cause');
      return;
    }

    if (formData.availability.hoursPerWeek <= 0) {
      setError('Please specify hours per week');
      return;
    }

    if (!user) {
      setError('You must be logged in to create a profile');
      return;
    }

    setIsSubmitting(true);

    try {
      await createVolunteerProfile(user.uid, formData);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Complete Your Volunteer Profile
          </h1>

          {error && (
            <div
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6"
              role="alert"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </section>

            {/* Location */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="location.city" className="block text-sm font-medium text-gray-700">
                    City *
                  </label>
                  <input
                    type="text"
                    id="location.city"
                    name="location.city"
                    required
                    value={formData.location.city}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="location.state" className="block text-sm font-medium text-gray-700">
                    State *
                  </label>
                  <input
                    type="text"
                    id="location.state"
                    name="location.state"
                    required
                    value={formData.location.state}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="location.remote"
                    checked={formData.location.remote}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Open to remote opportunities
                  </span>
                </label>
              </div>
            </section>

            {/* Skills */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Skills * (Select at least one)
              </h2>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {SKILLS_OPTIONS.map((skill) => (
                  <label key={skill} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.skills.includes(skill)}
                      onChange={() => handleArrayToggle('skills', skill)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{skill}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Causes */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Causes * (Select at least one)
              </h2>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {CAUSES_OPTIONS.map((cause) => (
                  <label key={cause} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.causes.includes(cause)}
                      onChange={() => handleArrayToggle('causes', cause)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{cause}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Availability */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Availability</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="availability.hoursPerWeek" className="block text-sm font-medium text-gray-700">
                    Hours per week *
                  </label>
                  <input
                    type="number"
                    id="availability.hoursPerWeek"
                    name="availability.hoursPerWeek"
                    min="1"
                    max="40"
                    required
                    value={formData.availability.hoursPerWeek}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Days
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {DAYS_OPTIONS.map((day) => (
                      <label key={day} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.availability.preferredDays.includes(day)}
                          onChange={() => handleArrayToggle('availability.preferredDays', day)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="availability.preferredTime" className="block text-sm font-medium text-gray-700">
                    Preferred Time
                  </label>
                  <select
                    id="availability.preferredTime"
                    name="availability.preferredTime"
                    value={formData.availability.preferredTime}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    {TIME_OPTIONS.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Commitment */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Commitment Level
              </h2>
              <div className="space-y-2">
                {COMMITMENT_OPTIONS.map((commitment) => (
                  <label key={commitment} className="flex items-center">
                    <input
                      type="radio"
                      name="commitment"
                      value={commitment}
                      checked={formData.commitment === commitment}
                      onChange={handleInputChange}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{commitment}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Experience & Bio */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Additional Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                    Experience
                  </label>
                  <textarea
                    id="experience"
                    name="experience"
                    rows={3}
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Tell us about your relevant experience..."
                  />
                </div>
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            </section>

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating Profile...' : 'Complete Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


