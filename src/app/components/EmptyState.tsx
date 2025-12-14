'use client';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

export default function EmptyState({ 
  icon, 
  title, 
  description, 
  actionLabel, 
  onAction 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] sm:min-h-[60vh] text-center animate-fade-in spacing-responsive">
      <div className="w-28 h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40 glass-strong rounded-2xl sm:rounded-3xl flex items-center justify-center mb-6 sm:mb-8 lg:mb-10 shadow-glass-medium animate-float group">
        <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-warm rounded-xl sm:rounded-2xl flex items-center justify-center shadow-glow-warm group-hover:scale-110 transition-transform duration-300">
          {icon ? (
            <span className="text-3xl sm:text-4xl lg:text-6xl drop-shadow-lg">{icon}</span>
          ) : (
            <svg className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
        </div>
      </div>
      <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 drop-shadow-lg tracking-tight">{title}</h2>
      <p className="font-body text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 lg:mb-10 max-w-sm sm:max-w-md lg:max-w-lg leading-relaxed drop-shadow-md font-medium px-4">
        {description}
      </p>
      <button
        onClick={onAction}
        className="font-body bg-gradient-sunset hover:shadow-glow-strong text-white font-bold touch-target py-3 sm:py-4 lg:py-5 px-6 sm:px-8 lg:px-10 rounded-xl sm:rounded-2xl transition-all duration-300 text-sm sm:text-base lg:text-lg hover-lift shadow-glass-medium border border-white/20 group"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <span>{actionLabel}</span>
          <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 group-hover:translate-x-1 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
      </button>
    </div>
  );
}