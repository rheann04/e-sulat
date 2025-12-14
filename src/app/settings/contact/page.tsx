'use client';

import { useRouter } from 'next/navigation';

export default function ContactPage() {
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
        <h1 className="text-xl font-bold text-gray-800">Contact Support</h1>
      </header>

      {/* Main Content */}
      <main className="p-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Get in Touch</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Email Support</h3>
              <p className="text-gray-600 mb-2">
                For technical issues or general inquiries:
              </p>
              <a 
                href="mailto:support@esulat.app" 
                className="text-blue-500 hover:text-blue-600 font-medium"
              >
                support@esulat.app
              </a>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Response Time</h3>
              <p className="text-gray-600">
                We typically respond to support requests within 24-48 hours during business days.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">What to Include</h3>
              <p className="text-gray-600">
                When contacting support, please include:<br/>
                • Description of the issue<br/>
                • Steps to reproduce the problem<br/>
                • Your device and browser information<br/>
                • Screenshots if applicable
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Feedback</h3>
              <p className="text-gray-600">
                We love hearing from our users! Send us your suggestions and feedback to help improve E-Sulat.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}