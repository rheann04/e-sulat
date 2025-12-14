'use client';

import { useRouter } from 'next/navigation';
import { useLanguage } from '../../contexts/LanguageContext';

export default function TermsPage() {
  const router = useRouter();
  const { t } = useLanguage();

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
        <h1 className="text-xl font-bold text-gray-800">{t('terms.title')}</h1>
      </header>

      {/* Main Content */}
      <main className="relative z-10 p-4">
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/30">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('terms.title')}</h2>
          
          <div className="space-y-6 text-gray-700">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('terms.acceptance')}</h3>
              <p>
                {t('terms.acceptanceDesc')}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('terms.description')}</h3>
              <p>
                {t('terms.descriptionDesc')}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('terms.userData')}</h3>
              <p>
                {t('terms.userDataDesc')}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('terms.privacy')}</h3>
              <p>
                {t('terms.privacyDesc')}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('terms.acceptableUse')}</h3>
              <p>
                {t('terms.acceptableUseDesc')}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('terms.limitation')}</h3>
              <p>
                {t('terms.limitationDesc')}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('terms.changes')}</h3>
              <p>
                {t('terms.changesDesc')}
              </p>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                {t('terms.lastUpdated')}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}