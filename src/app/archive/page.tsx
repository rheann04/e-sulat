'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { StorageHelpers } from '../utils/storage';
import { useLanguage } from '../contexts/LanguageContext';

interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
  createdAt: Date;
  status: 'pending' | 'completed';
  photos?: string[]; // Array of base64 encoded images
}

export default function ArchivePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [archivedNotes, setArchivedNotes] = useState<Note[]>([]);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    const loadArchivedNotes = async () => {
      const savedArchivedNotes = await StorageHelpers.getArchivedNotes();
      setArchivedNotes(savedArchivedNotes);
    };
    
    loadArchivedNotes();
  }, []);

  const handleSelectNote = (noteId: string) => {
    setSelectedNotes(prev => 
      prev.includes(noteId) 
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId]
    );
  };

  const handleUnarchive = async () => {
    const allNotes = await StorageHelpers.getNotes();
    
    const notesToUnarchive = archivedNotes.filter(note => selectedNotes.includes(note.id));
    const remainingArchived = archivedNotes.filter(note => !selectedNotes.includes(note.id));
    
    await StorageHelpers.setNotes([...allNotes, ...notesToUnarchive]);
    await StorageHelpers.setArchivedNotes(remainingArchived);
    
    setArchivedNotes(remainingArchived);
    setSelectedNotes([]);
  };

  const handleSelectAll = () => {
    if (selectedNotes.length === archivedNotes.length) {
      setSelectedNotes([]);
    } else {
      setSelectedNotes(archivedNotes.map(note => note.id));
    }
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
        <h1 className="text-xl font-bold text-gray-800 text-center">{t('archive.title')}</h1>
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

      {/* Action Buttons */}
      {selectedNotes.length > 0 && (
        <div className="bg-white/20 backdrop-blur-sm border-b border-white/30 p-4 flex gap-2 relative z-10">
          <button
            onClick={handleSelectAll}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
          >
            {selectedNotes.length === archivedNotes.length ? t('folder.unselectAll') : t('folder.selectAll')}
          </button>
          <button
            onClick={handleUnarchive}
            className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            {t('trash.restore')} ({selectedNotes.length})
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 p-4">
        {archivedNotes.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l6 6m0 0l6-6m-6 6V3" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('archive.noItems')}</h3>
            <p className="text-gray-600">{t('archive.noItemsDesc')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {archivedNotes
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((note) => (
                <div
                  key={note.id}
                  className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30 transition-all hover:bg-white/30 flex items-center gap-3"
                >
                  <input
                    type="checkbox"
                    checked={selectedNotes.includes(note.id)}
                    onChange={() => handleSelectNote(note.id)}
                    className="w-5 h-5 rounded border-2 border-gray-400 text-blue-500 focus:ring-blue-500 focus:ring-2"
                  />
                  
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-md">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">{note.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <span>{t('archive.archived')}</span>
                      <span>•</span>
                      <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={async () => {
                      setSelectedNotes([note.id]);
                      await handleUnarchive();
                    }}
                    className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50/20 rounded-lg transition-all"
                    title={t('trash.restore')}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  </button>
                </div>
              ))}
          </div>
        )}
      </main>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
}