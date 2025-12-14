'use client';

import { useRouter } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const { t } = useLanguage();

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  const handleExit = () => {
    router.push('/');
    onClose();
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="spacing-responsive h-full flex flex-col safe-area-padding">
          <div className="mb-6 sm:mb-8 lg:mb-10 pb-4 sm:pb-6 border-b border-white/30">
            <div className="flex items-center gap-3 sm:gap-4 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-warm shadow-glow-warm flex items-center justify-center">
                <img src="/logo.png" alt="Logo" className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-gray-800 truncate">{t('nav.menu')}</h2>
                <p className="font-accent text-gray-600 text-xs sm:text-sm hidden sm:block italic">{t('nav.navigate')}</p>
              </div>
            </div>
          </div>
          
          <nav className="space-y-2 sm:space-y-3 flex-1 hide-scrollbar-mobile overflow-y-auto">
            {/* Primary Features - Core functionality users access most frequently */}
            <button
              onClick={() => handleNavigation('/main')}
              className="font-body w-full text-left touch-target p-4 sm:p-5 hover:bg-white/30 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg text-gray-700 hover:text-blue-600 transition-all duration-300 backdrop-blur-sm shadow-glass hover:shadow-glass-medium hover-lift group flex items-center gap-3 sm:gap-4"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-ocean flex items-center justify-center text-white shadow-glow group-hover:scale-110 transition-transform flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="truncate">{t('nav.main')}</span>
            </button>
            <button
              onClick={() => handleNavigation('/reminder')}
              className="font-body w-full text-left touch-target p-4 sm:p-5 hover:bg-white/30 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg text-gray-700 hover:text-blue-600 transition-all duration-300 backdrop-blur-sm shadow-glass hover:shadow-glass-medium hover-lift group flex items-center gap-3 sm:gap-4"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-sunset flex items-center justify-center text-white shadow-glow group-hover:scale-110 transition-transform flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="truncate">{t('nav.reminder')}</span>
            </button>
            
            {/* Secondary Features - Content management and organization */}
            <button
              onClick={() => handleNavigation('/archive')}
              className="font-body w-full text-left touch-target p-4 sm:p-5 hover:bg-white/30 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg text-gray-700 hover:text-blue-600 transition-all duration-300 backdrop-blur-sm shadow-glass hover:shadow-glass-medium hover-lift group flex items-center gap-3 sm:gap-4"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-warm flex items-center justify-center text-white shadow-glow group-hover:scale-110 transition-transform flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l6 6m0 0l6-6m-6 6V3" />
                </svg>
              </div>
              <span className="truncate">{t('nav.archive')}</span>
            </button>
            <button
              onClick={() => handleNavigation('/trash')}
              className="font-body w-full text-left touch-target p-4 sm:p-5 hover:bg-white/30 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg text-gray-700 hover:text-blue-600 transition-all duration-300 backdrop-blur-sm shadow-glass hover:shadow-glass-medium hover-lift group flex items-center gap-3 sm:gap-4"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-secondary flex items-center justify-center text-white shadow-glow group-hover:scale-110 transition-transform flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <span className="truncate">{t('nav.trash')}</span>
            </button>
            
            {/* Settings - App configuration placed at bottom for easy access */}
            <button
              onClick={() => handleNavigation('/settings')}
              className="font-body w-full text-left touch-target p-4 sm:p-5 hover:bg-white/30 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg text-gray-700 hover:text-blue-600 transition-all duration-300 backdrop-blur-sm shadow-glass hover:shadow-glass-medium hover-lift group flex items-center gap-3 sm:gap-4"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-primary flex items-center justify-center text-white shadow-glow group-hover:scale-110 transition-transform flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="truncate">{t('nav.settings')}</span>
            </button>
          </nav>
          
          <div className="pt-4 sm:pt-6 border-t border-white/30 mt-auto">
            <button
              onClick={handleExit}
              className="font-body w-full bg-gradient-secondary text-white touch-target py-4 sm:py-5 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:shadow-glow-strong transition-all duration-300 shadow-glass-medium border border-white/20 hover-lift group"
            >
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="truncate">{t('nav.exit')}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}