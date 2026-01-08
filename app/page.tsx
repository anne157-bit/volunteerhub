import Link from "next/link";
import Image from "next/image"; // We'll use a standard img tag for now to avoid Next.config domain errors, but importing for future

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-32 lg:pb-28 bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            
            {/* Left: Text Content */}
            <div className="sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:text-left flex flex-col justify-center">
              <div>
                <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800 mb-4">
                  🚀 Join 10,000+ Volunteers
                </span>
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                  Make a difference in <span className="text-emerald-600 block">your community</span>
                </h1>
                <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                  VolunteerHub connects passionate people with local non-profits. 
                  Find opportunities that match your skills and schedule in just a few clicks.
                </p>
                <div className="mt-8 sm:flex sm:justify-center lg:justify-start gap-4">
                  <Link
                    href="/opportunities"
                    className="flex items-center justify-center rounded-lg border border-transparent bg-emerald-600 px-8 py-3 text-base font-medium text-white shadow-lg hover:bg-emerald-700 hover:shadow-emerald-200/50 transition-all"
                  >
                    Browse Opportunities
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-8 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-all"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: Image */}
            <div className="relative mt-12 sm:mx-auto sm:max-w-lg lg:col-span-6 lg:mx-0 lg:mt-0 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-3xl shadow-2xl lg:max-w-md overflow-hidden group">
                {/* Decorative background blob */}
                <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                
                {/* Image: Using a standard img tag to ensure it renders without next.config.js changes */}
                <img
                  className="relative w-full rounded-2xl object-cover transform transition-transform duration-500 group-hover:scale-105"
                  src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Volunteers working together"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURES / BENEFITS SECTION */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-base font-semibold uppercase tracking-wide text-emerald-600">Why VolunteerHub?</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Everything you need to make an impact
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <div className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-emerald-500 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="inline-flex rounded-lg bg-emerald-50 p-3 text-emerald-700 ring-4 ring-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Find Local Causes
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Discover non-profits right in your neighborhood that need your specific help.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-emerald-500 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="inline-flex rounded-lg bg-blue-50 p-3 text-blue-700 ring-4 ring-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Easy Applications
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Apply to multiple opportunities with a single profile. No repetitive forms.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-emerald-500 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="inline-flex rounded-lg bg-purple-50 p-3 text-purple-700 ring-4 ring-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Track Your Impact
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Log hours, receive certificates, and see the tangible difference you're making.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}