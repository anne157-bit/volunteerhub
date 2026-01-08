import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-emerald-50 to-white">
        <div className="container px-4 mx-auto md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            
            {/* Left: Text & CTAs */}
            <div className="space-y-6">
              <div className="inline-block px-3 py-1 text-sm font-semibold tracking-wider text-emerald-800 uppercase bg-emerald-100 rounded-full">
                Beta Now Live
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                Connect with local <span className="text-emerald-600">causes that matter.</span>
              </h1>
              <p className="text-lg text-gray-600 md:text-xl leading-relaxed">
                VolunteerHub is the easiest way to find volunteering opportunities in your city. 
                Match your skills with NGOs and track your real-world impact.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/opportunities"
                  className="inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-white bg-emerald-600 rounded-lg shadow-lg hover:bg-emerald-700 hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                >
                  Browse Opportunities
                </Link>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-emerald-700 bg-white border-2 border-emerald-100 rounded-lg hover:border-emerald-200 hover:bg-emerald-50 transition-all"
                >
                  Sign Up Free
                </Link>
              </div>
              
              <div className="pt-4 flex items-center gap-4 text-sm text-gray-500">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />
                  ))}
                </div>
                <p>Join 500+ volunteers in your area</p>
              </div>
            </div>

            {/* Right: Visual */}
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="relative rounded-2xl shadow-2xl overflow-hidden bg-gray-100 aspect-[4/3]">
                {/* Standard img tag used for MVP simplicity (avoids next.config domains setup) */}
                <img 
                  src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=1000"
                  alt="Volunteers working together"
                  className="object-cover w-full h-full"
                />
                {/* Gradient Overlay for text readability if needed, or style accent */}
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/10 to-transparent pointer-events-none" />
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* 2. FEATURES SECTION */}
      <section className="py-24 bg-white">
        <div className="container px-4 mx-auto md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why VolunteerHub?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need to make an impact, streamlined into one platform.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 text-2xl">
                📍
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Find Local Causes</h3>
              <p className="text-gray-600 leading-relaxed">
                Discover non-profits right in your neighborhood. Filter by location, cause, or time commitment.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-2xl">
                ⚡
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Easy Applications</h3>
              <p className="text-gray-600 leading-relaxed">
                Apply to multiple opportunities with a single profile. No more repetitive forms or long waits.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6 text-2xl">
                📈
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Track Your Impact</h3>
              <p className="text-gray-600 leading-relaxed">
                Log your hours automatically and earn certificates to showcase your contribution to the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FINAL CTA */}
      <section className="py-20 bg-emerald-900 text-white">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to make a difference?</h2>
          <p className="text-emerald-100 mb-8 max-w-2xl mx-auto text-lg">
            Join thousands of volunteers who are changing their communities one action at a time.
          </p>
          <Link
            href="/opportunities"
            className="inline-block px-8 py-4 bg-white text-emerald-900 font-bold rounded-lg hover:bg-emerald-50 transition-colors shadow-lg"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
}