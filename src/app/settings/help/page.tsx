'use client';

import { useRouter } from 'next/navigation';

export default function HelpPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-yellow-400">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          ←
        </button>
        <h1 className="text-xl font-bold text-gray-800">Help Center</h1>
      </header>

      {/* Main Content */}
      <main className="p-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
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