'use client';

import { useLanguage } from '../contexts/LanguageContext';

interface FloatingActionButtonsProps {
  onAllNotes?: () => void;
  onNewFolder: () => void;
  showAllNotes?: boolean;
}

export default function FloatingActionButtons({ 
  onAllNotes, 
  onNewFolder, 
  showAllNotes = true 
}: FloatingActionButtonsProps) {
  const { t } = useLanguage();
  return (
    <div className="fab-responsive safe-area-padding">
      {showAllNotes && (
        <button 
          onClick={onAllNotes}
          className="flex-1 glass-strong text-white touch-target py-3 sm:py-4 lg:py-5 px-4 sm:px-5 lg:px-6 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base lg:text-lg shadow-glass-medium hover:shadow-glow-strong border border-white/30 hover:bg-white/40 hover-lift backdrop-blur-xl group"
        >
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 group-hover:scale-110 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="hidden sm:inline">{t('folder.all').toUpperCase()}</span>
            <span className="sm:hidden">{t('folder.all').toUpperCase()}</span>
          </div>
        </button>
      )}
      <button
        onClick={onNewFolder}
        className="flex-1 bg-gradient-sunset text-white touch-target py-3 sm:py-4 lg:py-5 px-4 sm:px-5 lg:px-6 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base lg:text-lg shadow-glass-medium hover:shadow-glow-strong hover-lift border border-white/20 group"
      >
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 group-hover:scale-110 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="hidden sm:inline">{t('main.newFolder').toUpperCase()}</span>
          <span className="sm:hidden">{t('main.folders').toUpperCase()}</span>
        </div>
      </button>
    </div>
  );
}