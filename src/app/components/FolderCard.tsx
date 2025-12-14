'use client';

import { useState, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface Folder {
  id: string;
  name: string;
  createdAt: Date;
}

interface FolderCardProps {
  folder: Folder;
  onClick: (folderId: string) => void;
  onEdit?: (folder: Folder) => void;
  onDelete?: (folderId: string) => void;
}

export default function FolderCard({ folder, onClick, onEdit, onDelete }: FolderCardProps) {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const longPressTimer = useRef<number | null>(null);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const { t } = useLanguage();

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsLongPressing(false);
    longPressTimer.current = window.setTimeout(() => {
      setIsLongPressing(true);
      setShowContextMenu(true);
      // Add haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 500); // 500ms long press
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current);
    }
    if (!isLongPressing) {
      onClick(folder.id);
    }
    setIsLongPressing(false);
  };

  const handleTouchMove = () => {
    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current);
    }
    setIsLongPressing(false);
  };

  const handleMouseDown = () => {
    setIsLongPressing(false);
    longPressTimer.current = window.setTimeout(() => {
      setIsLongPressing(true);
      setShowContextMenu(true);
    }, 500);
  };

  const handleMouseUp = () => {
    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current);
    }
    if (!isLongPressing) {
      onClick(folder.id);
    }
    setIsLongPressing(false);
  };

  const handleMouseLeave = () => {
    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current);
    }
    setIsLongPressing(false);
  };

  const handleEdit = () => {
    setShowContextMenu(false);
    if (onEdit) {
      onEdit(folder);
    }
  };

  const handleDelete = () => {
    setShowContextMenu(false);
    if (onDelete) {
      onDelete(folder.id);
    }
  };

  const handleCancel = () => {
    setShowContextMenu(false);
  };

  return (
    <>
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className={`card-responsive glass-strong cursor-pointer hover:glass-strong hover-lift group shadow-glass hover:shadow-glass-medium border border-white/20 hover:border-white/30 backdrop-blur-xl transition-all duration-300 touch-target ${
          isLongPressing ? 'scale-95 shadow-glass-strong' : ''
        }`}
      >
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
          <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-gradient-warm shadow-glow-warm group-hover:scale-110 transition-all duration-300 flex-shrink-0">
            <span className="text-lg sm:text-xl lg:text-2xl">📁</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-bold text-lg sm:text-xl text-white truncate group-hover:text-white/90 transition-colors drop-shadow-md">
              {folder.name}
            </h3>
            <p className="font-caption text-xs sm:text-sm text-white/70 mt-1 sm:mt-2 font-medium">
              {t('main.created')} {new Date(folder.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>
          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/20 text-white group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300 shadow-glass flex-shrink-0">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {showContextMenu && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in safe-area-padding">
          <div className="glass-strong rounded-xl sm:rounded-2xl p-4 sm:p-6 m-4 max-w-xs sm:max-w-sm w-full shadow-glass-strong border border-white/30 backdrop-blur-xl animate-slide-up">
            <div className="text-center mb-4 sm:mb-6">
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">📁</div>
              <h3 className="font-heading text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2 truncate">{folder.name}</h3>
              <p className="font-body text-white/70 text-xs sm:text-sm">{t('common.chooseAction')}</p>
            </div>
            
            <div className="space-y-2 sm:space-y-3">
              <button
                onClick={handleEdit}
                className="w-full flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all duration-300 hover-lift touch-target"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="font-body font-medium text-sm sm:text-base">{t('common.edit')}</span>
              </button>
              
              <button
                onClick={handleDelete}
                className="w-full flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-red-500/20 hover:bg-red-500/30 text-white transition-all duration-300 hover-lift touch-target"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="font-body font-medium text-sm sm:text-base">{t('common.delete')}</span>
              </button>
              
              <button
                onClick={handleCancel}
                className="w-full flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-300 hover-lift touch-target"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="font-body font-medium text-sm sm:text-base">{t('main.cancel')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}