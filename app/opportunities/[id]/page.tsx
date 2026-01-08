"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { OPPORTUNITIES, Opportunity } from "@/lib/data"; // Import mock data

export default function OpportunityDetailPage() {
  const params = useParams();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [applicationStatus, setApplicationStatus] = useState<'idle' | 'applying' | 'done'>('idle');

  useEffect(() => {
    // Simulate finding the data with a small delay for realism
    if (params.id) {
      const found = OPPORTUNITIES.find((item) => item.id === Number(params.id));
      setTimeout(() => {
        setOpportunity(found || null);
        setLoading(false);
      }, 500);
    }
  }, [params.id]);

  const handleApply = () => {
    setApplicationStatus('applying');
    // Fake network request
    setTimeout(() => {
      setApplicationStatus('done');
      alert("Application Submitted! (This is a demo)");
    }, 1000);
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // 2. Not Found State
  if (!opportunity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center flex-col">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Opportunity not found</h1>
        <Link href="/opportunities" className="text-emerald-600 hover:text-emerald-500 font-medium">
          ← Back to Opportunities
        </Link>
      </div>
    );
  }

  // 3. Success State (The Detail View)
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar /> {/* Ensure Navbar is shown */}
      
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Link href="/opportunities" className="text-emerald-600 hover:text-emerald-500 mb-6 inline-block font-medium">
          ← Back to List
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          
          {/* Header */}
          <div className="p-8 border-b border-gray-100 bg-emerald-50/50">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wide text-emerald-800 uppercase bg-emerald-100 rounded-full">
                  {opportunity.type}
                </span>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{opportunity.title}</h1>
                <p className="text-lg text-emerald-700 font-medium">{opportunity.organization}</p>
              </div>
              
              <div className="text-right hidden md:block">
                 <span className="block text-sm text-gray-500">Date</span>
                 <span className="block font-medium text-gray-900">{opportunity.date}</span>
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-8 space-y-8">
            
            {/* Description */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">About this Role</h2>
              <p className="text-gray-600 leading-relaxed text-lg">{opportunity.description}</p>
            </section>

            {/* Grid Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Location</h3>
                <p className="text-gray-900 font-medium flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {opportunity.location || opportunity.city}
                </p>
              </div>
              <div>
                 <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">City</h3>
                 <p className="text-gray-900 font-medium">{opportunity.city}</p>
              </div>
            </div>

            {/* Requirements List */}
            {opportunity.requirements && (
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-3">Requirements</h2>
                <ul className="space-y-2">
                  {opportunity.requirements.map((req, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="h-6 w-6 text-emerald-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">{req}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Action Area */}
            <div className="pt-8 border-t border-gray-100">
              <button
                onClick={handleApply}
                disabled={applicationStatus !== 'idle'}
                className={`w-full md:w-auto px-8 py-3 rounded-lg font-bold text-white shadow-sm transition-all ${
                  applicationStatus === 'done' 
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                } disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {applicationStatus === 'idle' && 'Apply Now'}
                {applicationStatus === 'applying' && 'Submitting...'}
                {applicationStatus === 'done' && 'Application Submitted'}
              </button>
              <p className="mt-4 text-sm text-gray-500">
                * This is a demo. No login required.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}