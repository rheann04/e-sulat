'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Modal from '../../components/Modal';
import { useLanguage } from '../../contexts/LanguageContext';
import { StorageHelpers } from '../../utils/storage';

interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
  createdAt: Date;
  status: 'pending' | 'completed';
  isSelected?: boolean;
  photos?: string[]; // Array of base64 encoded images
}

interface Folder {
  id: string;
  name: string;
  createdAt: Date;
}

export default function FolderPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folder, setFolder] = useState<Folder | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [showNewNoteModal, setShowNewNoteModal] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [showActions, setShowActions] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const router = useRouter();
  const params = useParams();
  const folderId = params.id as string;
  const { t } = useLanguage();

  useEffect(() => {
    const loadData = async () => {
      // Load folder
      const savedFolders = await StorageHelpers.getFolders();
      const currentFolder = savedFolders.find((f: Folder) => f.id === folderId);
      setFolder(currentFolder || null);

      // Load notes
      const allNotes = await StorageHelpers.getNotes();
      const folderNotes = allNotes.filter((note: Note) => note.folderId === folderId);
      // Sort notes alphabetically by title
      const sortedNotes = folderNotes.sort((a: Note, b: Note) => a.title.localeCompare(b.title));
      setNotes(sortedNotes);
    };
    
    loadData();
  }, [folderId]);

  const filteredNotes = notes.filter(note => {
    if (filter === 'all') return true;
    return note.status === filter;
  });

  const handleCreateNote = async () => {
    if (noteTitle.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        title: noteTitle.trim(),
        content: '',
        folderId,
        createdAt: new Date(),
        status: 'pending'
      };
      
      const allNotes = await StorageHelpers.getNotes();
      const updatedNotes = [...allNotes, newNote];
      
      await StorageHelpers.setNotes(updatedNotes);
      const folderNotes = [...notes, newNote];
      // Sort notes alphabetically by title
      const sortedNotes = folderNotes.sort((a: Note, b: Note) => a.title.localeCompare(b.title));
      setNotes(sortedNotes);
      setNoteTitle('');
      setShowNewNoteModal(false);
    }
  };

  const handleNoteClick = (noteId: string) => {
    router.push(`/note/${noteId}`);
  };

  const handleSelectNote = (noteId: string) => {
    setSelectedNotes(prev => {
      const newSelected = prev.includes(noteId) 
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId];
      setShowActions(newSelected.length > 0);
      return newSelected;
    });
  };

  const handleToggleStatus = async (noteId: string) => {
    const allNotes = await StorageHelpers.getNotes();
    const updatedNotes = allNotes.map((note: Note) => {
      if (note.id === noteId) {
        return { ...note, status: note.status === 'pending' ? 'completed' : 'pending' };
      }
      return note;
    });
    
    await StorageHelpers.setNotes(updatedNotes);
    const folderNotes = updatedNotes.filter((note: Note) => note.folderId === folderId);
    const sortedNotes = folderNotes.sort((a: Note, b: Note) => a.title.localeCompare(b.title));
    setNotes(sortedNotes);
  };

  const handleEnterSelectMode = () => {
    setSelectMode(true);
    setSelectedNotes([]);
    setShowActions(false);
  };

  const handleExitSelectMode = () => {
    setSelectMode(false);
    setSelectedNotes([]);
    setShowActions(false);
  };

  const handleSelectAll = () => {
    if (selectedNotes.length === filteredNotes.length) {
      setSelectedNotes([]);
      setShowActions(false);
      setSelectMode(false);
    } else {
      const allIds = filteredNotes.map(note => note.id);
      setSelectedNotes(allIds);
      setShowActions(true);
    }
  };

  const handleArchive = async () => {
    const allNotes = await StorageHelpers.getNotes();
    const archived = await StorageHelpers.getArchivedNotes();
    
    const notesToArchive = allNotes.filter((note: Note) => selectedNotes.includes(note.id));
    const remainingNotes = allNotes.filter((note: Note) => !selectedNotes.includes(note.id));
    
    await StorageHelpers.setNotes(remainingNotes);
    await StorageHelpers.setArchivedNotes([...archived, ...notesToArchive]);
    
    const folderNotes = remainingNotes.filter((note: Note) => note.folderId === folderId);
    // Sort notes alphabetically by title
    const sortedNotes = folderNotes.sort((a: Note, b: Note) => a.title.localeCompare(b.title));
    setNotes(sortedNotes);
    setSelectedNotes([]);
    setShowActions(false);
    setSelectMode(false);
  };

  const handleDelete = async () => {
    const allNotes = await StorageHelpers.getNotes();
    
    const notesToTrash = allNotes.filter((note: Note) => selectedNotes.includes(note.id));
    const remainingNotes = allNotes.filter((note: Note) => !selectedNotes.includes(note.id));
    
    await StorageHelpers.setNotes(remainingNotes);
    
    // Add notes to unified trash system
    const savedTrashedItems = localStorage.getItem('trashedItems');
    const trashedItems = savedTrashedItems ? JSON.parse(savedTrashedItems) : [];
    
    const trashedNotes = notesToTrash.map((note: Note) => ({
      id: note.id,
      type: 'note' as const,
      data: note,
      deletedAt: new Date()
    }));
    
    const updatedTrashedItems = [...trashedItems, ...trashedNotes];
    localStorage.setItem('trashedItems', JSON.stringify(updatedTrashedItems));
    
    const folderNotes = remainingNotes.filter((note: Note) => note.folderId === folderId);
    // Sort notes alphabetically by title
    const sortedNotes = folderNotes.sort((a: Note, b: Note) => a.title.localeCompare(b.title));
    setNotes(sortedNotes);
    setSelectedNotes([]);
    setShowActions(false);
    setSelectMode(false);
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
      <header className="bg-white/20 backdrop-blur-sm shadow-lg header-responsive sticky top-0 z-10 relative safe-area-padding">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <button
            onClick={() => router.back()}
            className="touch-target p-2 hover:bg-white/20 rounded-lg sm:rounded-xl transition-all duration-200 text-gray-700 hover:text-gray-900 flex-shrink-0"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div className="text-xl sm:text-2xl flex-shrink-0">📁</div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-800 truncate">{folder?.name || 'Folder'}</h1>
          </div>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex w-full mb-3 sm:mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 touch-target py-2 rounded-l-lg sm:rounded-l-xl font-medium transition-all duration-200 text-sm sm:text-base ${
              filter === 'all' 
                ? 'bg-blue-500 text-white shadow-lg transform scale-105 z-10' 
                : 'bg-white/30 text-gray-700 hover:bg-white/40'
            }`}
          >
            {t('folder.all')} ({notes.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`flex-1 touch-target py-2 font-medium transition-all duration-200 text-sm sm:text-base border-l border-r border-white/20 ${
              filter === 'pending' 
                ? 'bg-orange-500 text-white shadow-lg transform scale-105 z-10' 
                : 'bg-white/30 text-gray-700 hover:bg-white/40'
            }`}
          >
            {t('folder.pending')} ({notes.filter(n => n.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`flex-1 touch-target py-2 rounded-r-lg sm:rounded-r-xl font-medium transition-all duration-200 text-sm sm:text-base ${
              filter === 'completed' 
                ? 'bg-green-500 text-white shadow-lg transform scale-105 z-10' 
                : 'bg-white/30 text-gray-700 hover:bg-white/40'
            }`}
          >
            {t('folder.done')} ({notes.filter(n => n.status === 'completed').length})
          </button>
        </div>

        {/* Select Mode Button */}
        <div className="flex gap-2 mb-3 sm:mb-4">
          {!selectMode ? (
            <button
              onClick={handleEnterSelectMode}
              className="touch-target px-4 sm:px-6 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl sm:rounded-2xl font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              ✓ {t('folder.select')}
            </button>
          ) : (
            <button
              onClick={handleExitSelectMode}
              className="touch-target px-4 sm:px-6 py-2.5 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl sm:rounded-2xl font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              ✕ {t('folder.cancel')}
            </button>
          )}
        </div>

        {/* Action Buttons */}
        {selectMode && showActions && (
          <div className="flex gap-2 sm:gap-3 mb-3 sm:mb-4 p-3 sm:p-4 bg-white/30 rounded-xl sm:rounded-2xl backdrop-blur-md border border-white/40 shadow-xl overflow-x-auto hide-scrollbar-mobile">
            <button
              onClick={handleSelectAll}
              className="touch-target px-4 sm:px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 text-xs sm:text-sm whitespace-nowrap flex-shrink-0 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {selectedNotes.length === filteredNotes.length ? t('folder.unselectAll') : t('folder.selectAll')}
            </button>
            <button
              onClick={handleArchive}
              className="touch-target px-4 sm:px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 text-xs sm:text-sm whitespace-nowrap flex-shrink-0 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l6 6V9l6-6V3h-5L9 6H4v2z" />
              </svg>
              {t('folder.archive')}
            </button>
            <button
              onClick={handleDelete}
              className="touch-target px-4 sm:px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 text-xs sm:text-sm whitespace-nowrap flex-shrink-0 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {t('folder.delete')}
            </button>
          </div>
        )}
      </header>

      {/* Notes List */}
      <main className="relative z-10 container-responsive spacing-responsive pb-20 sm:pb-24">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">📝</div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">{t('folder.noNotes')}</h3>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">{t('folder.noNotesDesc')}</p>
            <button
              onClick={() => setShowNewNoteModal(true)}
              className="touch-target px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg sm:rounded-xl font-medium transition-all duration-200 shadow-lg text-sm sm:text-base"
            >
              {t('folder.createFirstNote')}
            </button>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredNotes.map((note, index) => (
              <div
                key={note.id}
                className="card-responsive bg-white/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3 sm:gap-4 group hover:bg-white/40"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {selectMode && (
                  <input
                    type="checkbox"
                    checked={selectedNotes.includes(note.id)}
                    onChange={() => handleSelectNote(note.id)}
                    className="w-3 h-3 sm:w-4 sm:h-4 rounded-md border-2 border-gray-300 text-blue-500 focus:ring-blue-500 flex-shrink-0"
                  />
                )}
                {!selectMode && (
                  <button
                    onClick={() => handleToggleStatus(note.id)}
                    className={`touch-target w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                      note.status === 'completed' 
                        ? 'bg-green-500 border-green-500 text-white shadow-md' 
                        : 'border-gray-400 hover:border-green-400 hover:bg-green-50'
                    }`}
                  >
                    {note.status === 'completed' && (
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                )}
                <div
                  onClick={() => !selectMode && handleNoteClick(note.id)}
                  className={`flex-1 min-w-0 ${!selectMode ? 'cursor-pointer' : ''}`}
                >
                  <h3 className={`font-semibold text-base sm:text-lg mb-1 transition-all duration-200 truncate ${
                    note.status === 'completed' 
                      ? 'text-gray-500 line-through' 
                      : 'text-gray-800 group-hover:text-gray-900'
                  }`}>
                    {note.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                    <span className="truncate">{new Date(note.createdAt).toLocaleDateString()}</span>
                    <span className="flex-shrink-0">•</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                      note.status === 'completed' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {note.status === 'completed' ? t('status.completed') : t('status.pending')}
                    </span>
                    {note.photos && note.photos.length > 0 && (
                      <>
                        <span className="flex-shrink-0">•</span>
                        <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex-shrink-0">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {note.photos.length}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                {!selectMode && (
                  <div className="text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add Note Button */}
      <button
        onClick={() => setShowNewNoteModal(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 flex items-center justify-center text-xl sm:text-2xl transition-all duration-300 group touch-target safe-area-padding"
      >
        <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* New Note Modal */}
      {showNewNoteModal && (
        <Modal onClose={() => setShowNewNoteModal(false)}>
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{t('folder.newNote')}</h2>
            <p className="text-gray-500 text-sm">{t('folder.whatsOnMind')}</p>
          </div>
          <div className="mb-6">
            <input
              type="text"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder={t('folder.noteTitle')}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 text-base"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleCreateNote()}
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowNewNoteModal(false)}
              className="flex-1 py-3 px-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              {t('folder.cancel')}
            </button>
            <button
              onClick={handleCreateNote}
              disabled={!noteTitle.trim()}
              className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              {t('main.create')}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}