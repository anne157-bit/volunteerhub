import Link from "next/link";

export default function Home() {
  return (
    // ADDED: Main container with gradient background and centering
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white to-emerald-50 px-4 text-center">
      
      {/* Hero Content */}
      <div className="max-w-3xl space-y-6">
        {/* EXISTING: Enhanced Heading */}
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900">
          Welcome to <span className="text-emerald-600">VolunteerHub</span>
        </h1>
        
        {/* EXISTING: Enhanced Description */}
        <p className="text-xl text-gray-600 md:text-2xl">
          Connect with meaningful opportunities, build your skills, and make a real difference in your community.
        </p>

        {/* ADDED: CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link 
            href="/opportunities"
            className="px-8 py-4 bg-emerald-600 text-white rounded-lg font-semibold text-lg shadow-lg hover:bg-emerald-700 hover:shadow-xl transition-all transform hover:-translate-y-0.5"
          >
            Browse Opportunities
          </Link>
          
          <Link 
            href="/auth/signup"
            className="px-8 py-4 bg-white text-emerald-600 border-2 border-emerald-600 rounded-lg font-semibold text-lg hover:bg-emerald-50 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* ADDED: Benefits/Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-5xl w-full px-4">
        {/* Feature 1 */}
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4 mx-auto text-2xl">
            🤝
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Community</h3>
          <p className="text-gray-600">Join a network of passionate individuals working towards common goals.</p>
        </div>

        {/* Feature 2 */}
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto text-2xl">
            🌍
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Impact</h3>
          <p className="text-gray-600">Find projects where your contribution creates tangible, positive change.</p>
        </div>

        {/* Feature 3 */}
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto text-2xl">
            🚀
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Growth</h3>
          <p className="text-gray-600">Develop new skills and gain experience while helping others.</p>
        </div>
      </div>
    </div>
  );
}