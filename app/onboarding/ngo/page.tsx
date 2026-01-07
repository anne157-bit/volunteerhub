'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { createNGOProfile } from '@/lib/firebase/ngos';
import type { NGOProfileFormData } from '@/types/user';

const IMPACT_AREAS_OPTIONS = [
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

export default function NGOOnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<NGOProfileFormData>({
    name: '',
    email: '',
    phone: '',
    organizationName: '',
    description: '',
    impactAreas: [],
    website: '',
    registrationNumber: '',
    foundedYear: undefined,
    location: {
      city: '',
      state: '',
      address: '',
    },
    socialMedia: {
      website: '',
      linkedin: '',
      instagram: '',
      facebook: '',
    },
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
      if (parent === 'location') {
        setFormData((prev) => ({
          ...prev,
          location: {
            ...prev.location,
            [child]: value,
          },
        }));
      } else if (parent === 'socialMedia') {
        setFormData((prev) => ({
          ...prev,
          socialMedia: {
            ...(prev.socialMedia || {}),
            [child]: value,
          },
        }));
      }
    } else if (name === 'foundedYear') {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? Number(value) : undefined,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleImpactAreaToggle = (impactArea: string) => {
    setFormData((prev) => ({
      ...prev,
      impactAreas: prev.impactAreas.includes(impactArea)
        ? prev.impactAreas.filter((area) => area !== impactArea)
        : [...prev.impactAreas, impactArea],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name || !formData.email) {
      setError('Name and email are required');
      return;
    }

    if (!formData.organizationName) {
      setError('Organization name is required');
      return;
    }

    if (!formData.description) {
      setError('Description is required');
      return;
    }

    if (formData.impactAreas.length === 0) {
      setError('Please select at least one impact area');
      return;
    }

    if (!formData.location.city || !formData.location.state) {
      setError('City and state are required');
      return;
    }

    if (!user) {
      setError('You must be logged in to create a profile');
      return;
    }

    setIsSubmitting(true);

    try {
      await createNGOProfile(user.uid, formData);
      router.push('/ngo/dashboard');
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
            Complete Your NGO Profile
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
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    id="organizationName"
                    name="organizationName"
                    required
                    value={formData.organizationName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Your organization's name"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                      Website
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="https://example.org"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Organization Details */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Organization Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={5}
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Describe your organization's mission, goals, and impact..."
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">
                      Registration Number
                    </label>
                    <input
                      type="text"
                      id="registrationNumber"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Legal registration number"
                    />
                  </div>
                  <div>
                    <label htmlFor="foundedYear" className="block text-sm font-medium text-gray-700">
                      Founded Year
                    </label>
                    <input
                      type="number"
                      id="foundedYear"
                      name="foundedYear"
                      min="1800"
                      max={new Date().getFullYear()}
                      value={formData.foundedYear || ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="2020"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Impact Areas */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Impact Areas * (Select at least one)
              </h2>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {IMPACT_AREAS_OPTIONS.map((area) => (
                  <label key={area} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.impactAreas.includes(area)}
                      onChange={() => handleImpactAreaToggle(area)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{area}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Location */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
              <div className="space-y-4">
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
                <div>
                  <label htmlFor="location.address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    id="location.address"
                    name="location.address"
                    value={formData.location.address}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Street address (optional)"
                  />
                </div>
              </div>
            </section>

            {/* Social Media */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Social Media & Links
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="socialMedia.website" className="block text-sm font-medium text-gray-700">
                    Website URL
                  </label>
                  <input
                    type="url"
                    id="socialMedia.website"
                    name="socialMedia.website"
                    value={formData.socialMedia?.website || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="https://example.org"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="socialMedia.linkedin" className="block text-sm font-medium text-gray-700">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      id="socialMedia.linkedin"
                      name="socialMedia.linkedin"
                      value={formData.socialMedia?.linkedin || ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="https://linkedin.com/company/..."
                    />
                  </div>
                  <div>
                    <label htmlFor="socialMedia.instagram" className="block text-sm font-medium text-gray-700">
                      Instagram
                    </label>
                    <input
                      type="url"
                      id="socialMedia.instagram"
                      name="socialMedia.instagram"
                      value={formData.socialMedia?.instagram || ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="socialMedia.facebook" className="block text-sm font-medium text-gray-700">
                    Facebook
                  </label>
                  <input
                    type="url"
                    id="socialMedia.facebook"
                    name="socialMedia.facebook"
                    value={formData.socialMedia?.facebook || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="https://facebook.com/..."
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

