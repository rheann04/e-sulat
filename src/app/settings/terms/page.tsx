'use client';

import { useRouter } from 'next/navigation';

export default function TermsPage() {
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
        <h1 className="text-xl font-bold text-gray-800">Terms of Service</h1>
      </header>

      {/* Main Content */}
      <main className="p-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Terms of Service</h2>
          
          <div className="space-y-6 text-gray-700">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">1. Acceptance of Terms</h3>
              <p>
                By using E-Sulat, you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our application.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">2. Description of Service</h3>
              <p>
                E-Sulat is a personal note-taking and reminder application that allows users to 
                create, organize, and manage their notes and reminders.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">3. User Data</h3>
              <p>
                Your notes and data are stored locally on your device. We do not collect, 
                store, or transmit your personal notes or content to external servers.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">4. Privacy</h3>
              <p>
                We respect your privacy. All your notes and personal information remain 
                on your device and are not shared with third parties.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">5. Acceptable Use</h3>
              <p>
                You agree to use E-Sulat only for lawful purposes and in accordance with 
                these Terms of Service. You are responsible for all content you create.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">6. Limitation of Liability</h3>
              <p>
                E-Sulat is provided "as is" without warranties of any kind. We are not 
                liable for any loss of data or damages arising from the use of this application.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">7. Changes to Terms</h3>
              <p>
                We reserve the right to modify these terms at any time. Continued use of 
                the application constitutes acceptance of any changes.
              </p>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Last updated: December 14, 2024
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}