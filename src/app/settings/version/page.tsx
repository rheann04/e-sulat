'use client';

import { useRouter } from 'next/navigation';

export default function VersionPage() {
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
        <h1 className="text-xl font-bold text-gray-800">Version</h1>
      </header>

      {/* Main Content */}
      <main className="p-4">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">E</span>
          </div>
          
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