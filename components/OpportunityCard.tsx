import Link from "next/link";
import { Opportunity } from "@/lib/data"; // Use the shared interface

export default function OpportunityCard({ job }: { job: Opportunity }) {
  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden h-full">
      <div className="p-5 flex flex-col flex-grow">
        {/* Header: Tag & Date */}
        <div className="flex justify-between items-start mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            {job.type}
          </span>
          <span className="text-xs text-gray-500">{job.date}</span>
        </div>

        {/* Title & Org */}
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{job.title}</h3>
        <p className="text-sm text-emerald-600 font-medium mb-3">{job.organization}</p>

        {/* Location */}
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {job.city}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
          {job.description}
        </p>

        {/* Footer: Button wrapped in Link */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          {/* UPDATED: Added Link here */}
          <Link href={`/opportunities/${job.id}`} className="block w-full">
            <button className="w-full py-2 px-4 bg-white border border-emerald-600 text-emerald-600 rounded-lg text-sm font-semibold hover:bg-emerald-50 transition-colors">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}