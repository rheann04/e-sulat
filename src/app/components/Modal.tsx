'use client';

import { useEffect } from 'react';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div 
        className="modal glass-strong shadow-glass-strong border border-white/30 backdrop-blur-xl transform transition-all duration-300 scale-100 animate-slide-up relative" 
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 touch-target flex items-center justify-center rounded-xl sm:rounded-2xl hover:bg-white/20 transition-all duration-300 group shadow-glass hover:shadow-glass-medium z-10"
          aria-label="Close modal"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="pr-8 sm:pr-12">
          {children}
        </div>
      </div>
    </div>
  );
}