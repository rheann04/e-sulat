'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('ENGLISH');
  const router = useRouter();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
    }
  }, []);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    localStorage.setItem('language', language);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-yellow-400">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            ←
          </button>
          <h1 className="text-xl font-bold text-gray-800">Settings</h1>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <div className="w-6 h-6 flex flex-col justify-center gap-1">
            <div className="w-full h-0.5 bg-gray-600"></div>
            <div className="w-full h-0.5 bg-gray-600"></div>
            <div className="w-full h-0.5 bg-gray-600"></div>
          </div>
        </button>
      </header>

      {/* Main Content */}
      <main className="p-4">
        <div className="space-y-4">
          {/* Language Section */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Language</h2>
            <div className="space-y-2">
              {['ENGLISH', 'TAGALOG', 'BISAYA'].map((language) => (
                <label key={language} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <input
                    type="radio"
                    name="language"
                    value={language}
                    checked={selectedLanguage === language}
                    onChange={() => handleLanguageChange(language)}
                    className="text-blue-500"
                  />
                  <span className="font-medium">{language}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Other Settings */}
          <div className="space-y-3">
            <button
              onClick={() => handleNavigation('/settings/help')}
              className="w-full bg-white p-4 rounded-lg shadow-sm text-left hover:bg-gray-50 flex items-center justify-between"
            >
              <span className="font-medium">Help Center</span>
              <span>→</span>
            </button>
            
            <button
              onClick={() => handleNavigation('/settings/contact')}
              className="w-full bg-white p-4 rounded-lg shadow-sm text-left hover:bg-gray-50 flex items-center justify-between"
            >
              <span className="font-medium">Contact Support</span>
              <span>→</span>
            </button>
            
            <button
              onClick={() => handleNavigation('/settings/version')}
              className="w-full bg-white p-4 rounded-lg shadow-sm text-left hover:bg-gray-50 flex items-center justify-between"
            >
              <span className="font-medium">Version</span>
              <span>→</span>
            </button>
            
            <button
              onClick={() => handleNavigation('/settings/terms')}
              className="w-full bg-white p-4 rounded-lg shadow-sm text-left hover:bg-gray-50 flex items-center justify-between"
            >
              <span className="font-medium">Terms of Service</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </main>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
}