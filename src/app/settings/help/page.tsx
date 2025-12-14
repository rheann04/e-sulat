'use client';

import { useRouter } from 'next/navigation';

export default function HelpPage() {
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
        <h1 className="text-xl font-bold text-gray-800">Help Center</h1>
      </header>

      {/* Main Content */}
      <main className="relative z-10 p-4">
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/30">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">How to use E-Sulat</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Creating Notes</h3>
              <p className="text-gray-600">
                1. Create a new folder from the main page<br/>
                2. Open the folder and tap the + button<br/>
                3. Enter a title for your note<br/>
                4. Start writing your content
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Organizing Notes</h3>
              <p className="text-gray-600">
                • Use folders to organize your notes by topic<br/>
                • Mark notes as pending or completed<br/>
                • Archive notes you want to keep but don't need active<br/>
                • Delete notes you no longer need
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Customizing Notes</h3>
              <p className="text-gray-600">
                • Change the theme color of individual notes<br/>
                • Select different fonts for better readability<br/>
                • Add images to your notes (coming soon)
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Managing Data</h3>
              <p className="text-gray-600">
                • Archived notes can be restored from the Archive page<br/>
                • Deleted notes go to Trash and can be restored<br/>
                • Permanently delete notes from Trash when no longer needed
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}