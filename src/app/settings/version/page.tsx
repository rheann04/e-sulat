'use client';

import { useRouter } from 'next/navigation';

export default function VersionPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 relative overflow-hidden">
      {/* Enhanced Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-pink-300/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-300/20 to-cyan-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-gradient-to-br from-yellow-200/10 to-orange-300/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-green-300/15 to-teal-400/15 rounded-full blur-2xl animate-float" style={{animationDelay: '3s'}}></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-indigo-300/15 to-purple-400/15 rounded-full blur-2xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Header */}
      <header className="bg-white/20 backdrop-blur-sm shadow-lg p-4 flex items-center gap-3 relative z-10">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-white/20 rounded-lg transition-all"
        >
          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-gray-800">Version</h1>
      </header>

      {/* Main Content */}
      <main className="relative z-10 p-4">
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/30 text-center">
          <img
            src="/logo.png"
            alt="E-Sulat Logo"
            className="w-16 h-16 rounded-full mx-auto mb-4"
          />
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">E-Sulat</h2>
          <p className="text-gray-600 mb-6">Your personal notes and reminder app</p>
          
          <div className="space-y-4 text-left max-w-sm mx-auto">
            <div className="flex justify-between">
              <span className="text-gray-600">Version:</span>
              <span className="font-medium">1.0.0</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Build:</span>
              <span className="font-medium">2024.12.14</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Platform:</span>
              <span className="font-medium">Web</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Framework:</span>
              <span className="font-medium">Next.js</span>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">What's New</h3>
            <ul className="text-left text-gray-600 space-y-1">
              <li>• Create and organize notes in folders</li>
              <li>• Customize note themes and fonts</li>
              <li>• Archive and trash functionality</li>
              <li>• Multi-language support</li>
              <li>• Responsive design for all devices</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}