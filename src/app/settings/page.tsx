'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import { useLanguage, Language } from '../contexts/LanguageContext';

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setShowLanguageOptions(false);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

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
      <header className="bg-white/20 backdrop-blur-sm shadow-lg p-4 flex justify-between items-center relative z-10">
        <div className="w-10"></div>
        <h1 className="text-xl font-bold text-gray-800 text-center">{t('settings.title')}</h1>
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
      <main className="relative z-10 p-4">
        <div className="space-y-4">
          {/* Language Section */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg overflow-hidden">
            <button
              onClick={() => setShowLanguageOptions(!showLanguageOptions)}
              className="w-full p-4 text-left hover:bg-white/30 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
                <div>
                  <span className="font-medium text-gray-800">{t('settings.language')}</span>
                  <div className="text-sm text-gray-600">{mounted ? language : 'ENGLISH'}</div>
                </div>
              </div>
              <svg className={`w-5 h-5 text-gray-600 transition-transform ${showLanguageOptions ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Inline Language Options */}
            {showLanguageOptions && (
              <div className="border-t border-white/20 bg-white/10 backdrop-blur-sm">
                <div className="p-4 space-y-3">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{t('settings.language')}</h3>
                    <p className="text-sm text-gray-600">Choose your preferred language</p>
                  </div>
                  
                  <div className="space-y-2">
                    {(['ENGLISH', 'TAGALOG', 'BISAYA'] as Language[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => handleLanguageChange(lang)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all border-2 ${
                          language === lang
                            ? 'border-blue-400 bg-blue-500/20 shadow-lg'
                            : 'border-white/20 bg-white/10 hover:bg-white/20 hover:border-white/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full transition-all ${
                            language === lang ? 'bg-blue-400' : 'bg-white/40'
                          }`}></div>
                          <span className={`font-medium transition-colors ${
                            language === lang ? 'text-blue-800' : 'text-gray-700'
                          }`}>
                            {lang}
                          </span>
                        </div>
                        {language === lang && (
                          <div className="px-2 py-1 bg-blue-400 text-blue-900 rounded-full text-xs font-medium">
                            Current
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Other Settings */}
          <div className="space-y-3">
            <button
              onClick={() => handleNavigation('/settings/help')}
              className="w-full bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30 shadow-lg text-left hover:bg-white/30 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="font-medium text-gray-800">{t('settings.helpCenter')}</span>
              </div>
              <svg className="w-5 h-5 text-gray-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            <button
              onClick={() => handleNavigation('/settings/contact')}
              className="w-full bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30 shadow-lg text-left hover:bg-white/30 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="font-medium text-gray-800">{t('settings.contactSupport')}</span>
              </div>
              <svg className="w-5 h-5 text-gray-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            <button
              onClick={() => handleNavigation('/settings/version')}
              className="w-full bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30 shadow-lg text-left hover:bg-white/30 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="font-medium text-gray-800">{t('settings.version')}</span>
              </div>
              <svg className="w-5 h-5 text-gray-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            <button
              onClick={() => handleNavigation('/settings/terms')}
              className="w-full bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30 shadow-lg text-left hover:bg-white/30 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="font-medium text-gray-800">{t('settings.termsOfService')}</span>
              </div>
              <svg className="w-5 h-5 text-gray-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </main>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />


    </div>
  );
}