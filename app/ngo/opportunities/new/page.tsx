'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { requireNGO } from '@/lib/utils/auth-guard';
import { createOpportunity } from '@/lib/firebase/opportunities';
import type { OpportunityFormData, OpportunitySkill } from '@/types/opportunity';
import type { NGO } from '@/types/user';
import Navbar from '@/components/Navbar';

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

const PERKS_OPTIONS = [
  'Certificate',
  'Meals provided',
  'Transportation',
  'Stipend',
  'Training provided',
  'Networking opportunities',
];

export default function CreateOpportunityPage() {
  const router = useRouter();
  const { user, profile, loading, profileComplete, isNGO: userIsNGO } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<OpportunityFormData>({
    title: '',
    description: '',
    requirements: '',
    skills: [],
    cause: '',
    location: {
      type: 'on-site',
      city: '',
      state: '',
      address: '',
    },
    schedule: {
      startDate: new Date(),
      endDate: new Date(),
      hoursRequired: 0,
      flexible: false,
    },
    capacity: {
      total: 1,
      minRequired: 1,
    },
    perks: [],
    tags: [],
    status: 'draft',
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }

    if (!loading && user && !profileComplete) {
      router.push('/onboarding/ngo');
      return;
    }

    if (!loading && user && profile && !userIsNGO) {
      router.push('/dashboard');
      return;
    }
  }, [user, profile, loading, profileComplete, userIsNGO, router]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'location' || parent === 'schedule' || parent === 'capacity') {
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...(prev[parent as keyof OpportunityFormData] as object),
            [child]:
              type === 'checkbox'
                ? checked
                : type === 'number'
                ? Number(value)
                : value,
          },
        }));
      }
    } else if (name === 'status') {
      setFormData((prev) => ({
        ...prev,
        status: value as 'draft' | 'active' | 'filled' | 'completed' | 'cancelled',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleDateChange = (name: string, value: string) => {
    const date = new Date(value);
    if (name === 'schedule.startDate') {
      setFormData((prev) => ({
        ...prev,
        schedule: {
          ...prev.schedule,
          startDate: date,
        },
      }));
    } else if (name === 'schedule.endDate') {
      setFormData((prev) => ({
        ...prev,
        schedule: {
          ...prev.schedule,
          endDate: date,
        },
      }));
    }
  };

  const handleSkillToggle = (skillName: string, importance: 'required' | 'preferred' | 'bonus') => {
    setFormData((prev) => {
      const existingIndex = prev.skills.findIndex((s) => s.name === skillName);
      
      if (existingIndex >= 0) {
        // Update existing skill importance
        const newSkills = [...prev.skills];
        newSkills[existingIndex] = { name: skillName, importance };
        return { ...prev, skills: newSkills };
      } else {
        // Add new skill
        return {
          ...prev,
          skills: [...prev.skills, { name: skillName, importance }],
        };
      }
    });
  };

  const handlePerkToggle = (perk: string) => {
    setFormData((prev) => ({
      ...prev,
      perks: prev.perks?.includes(perk)
        ? prev.perks.filter((p) => p !== perk)
        : [...(prev.perks || []), perk],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.title || !formData.description) {
      setError('Title and description are required');
      return;
    }

    if (formData.skills.length === 0) {
      setError('Please select at least one skill');
      return;
    }

    if (!formData.cause) {
      setError('Please select a cause');
      return;
    }

    if (formData.location.type !== 'remote' && !formData.location.city) {
      setError('City is required for on-site and hybrid opportunities');
      return;
    }

    if (!user || !profile || !requireNGO(user, profile)) {
      setError('You must be logged in as an NGO to create opportunities');
      return;
    }

    setIsSubmitting(true);

    try {
      const ngoProfile = profile as NGO;
      await createOpportunity(ngoProfile.id, ngoProfile.organizationName, formData);
      router.push('/ngo/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create opportunity');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile || !requireNGO(user, profile)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Create New Opportunity
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
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="e.g., Teach Coding to Underprivileged Children"
                  />
                </div>
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
                    placeholder="Describe the opportunity in detail..."
                  />
                </div>
                <div>
                  <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
                    Requirements
                  </label>
                  <textarea
                    id="requirements"
                    name="requirements"
                    rows={3}
                    value={formData.requirements}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="What are the requirements for volunteers?"
                  />
                </div>
              </div>
            </section>

            {/* Skills and Cause */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Skills & Cause
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required Skills *
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {SKILLS_OPTIONS.map((skill) => {
                      const existingSkill = formData.skills.find((s) => s.name === skill);
                      return (
                        <div key={skill} className="space-y-1">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={!!existingSkill}
                              onChange={() =>
                                handleSkillToggle(
                                  skill,
                                  existingSkill?.importance || 'preferred'
                                )
                              }
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{skill}</span>
                          </label>
                          {existingSkill && (
                            <select
                              value={existingSkill.importance}
                              onChange={(e) =>
                                handleSkillToggle(
                                  skill,
                                  e.target.value as 'required' | 'preferred' | 'bonus'
                                )
                              }
                              className="ml-6 text-xs rounded border-gray-300"
                            >
                              <option value="required">Required</option>
                              <option value="preferred">Preferred</option>
                              <option value="bonus">Bonus</option>
                            </select>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label htmlFor="cause" className="block text-sm font-medium text-gray-700">
                    Cause *
                  </label>
                  <select
                    id="cause"
                    name="cause"
                    required
                    value={formData.cause}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">Select a cause</option>
                    {CAUSES_OPTIONS.map((cause) => (
                      <option key={cause} value={cause}>
                        {cause}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Location */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="location.type" className="block text-sm font-medium text-gray-700">
                    Location Type *
                  </label>
                  <select
                    id="location.type"
                    name="location.type"
                    required
                    value={formData.location.type}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="remote">Remote</option>
                    <option value="on-site">On-site</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                {formData.location.type !== 'remote' && (
                  <>
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
                      />
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* Schedule */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Schedule</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="schedule.startDate" className="block text-sm font-medium text-gray-700">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      id="schedule.startDate"
                      name="schedule.startDate"
                      required
                      value={formData.schedule.startDate.toISOString().split('T')[0]}
                      onChange={(e) => handleDateChange('schedule.startDate', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="schedule.endDate" className="block text-sm font-medium text-gray-700">
                      End Date *
                    </label>
                    <input
                      type="date"
                      id="schedule.endDate"
                      name="schedule.endDate"
                      required
                      value={formData.schedule.endDate.toISOString().split('T')[0]}
                      onChange={(e) => handleDateChange('schedule.endDate', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="schedule.hoursRequired" className="block text-sm font-medium text-gray-700">
                    Hours Required *
                  </label>
                  <input
                    type="number"
                    id="schedule.hoursRequired"
                    name="schedule.hoursRequired"
                    min="1"
                    required
                    value={formData.schedule.hoursRequired}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="schedule.flexible"
                      checked={formData.schedule.flexible}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Flexible schedule</span>
                  </label>
                </div>
              </div>
            </section>

            {/* Capacity */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Capacity</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="capacity.total" className="block text-sm font-medium text-gray-700">
                    Total Volunteers Needed *
                  </label>
                  <input
                    type="number"
                    id="capacity.total"
                    name="capacity.total"
                    min="1"
                    required
                    value={formData.capacity.total}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="capacity.minRequired" className="block text-sm font-medium text-gray-700">
                    Minimum Required *
                  </label>
                  <input
                    type="number"
                    id="capacity.minRequired"
                    name="capacity.minRequired"
                    min="1"
                    required
                    value={formData.capacity.minRequired}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </section>

            {/* Perks */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Perks</h2>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {PERKS_OPTIONS.map((perk) => (
                  <label key={perk} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.perks?.includes(perk) || false}
                      onChange={() => handlePerkToggle(perk)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{perk}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Status */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Status</h2>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Initial Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                </select>
              </div>
            </section>

            {/* Submit */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.push('/ngo/dashboard')}
                className="px-6 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Opportunity'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

