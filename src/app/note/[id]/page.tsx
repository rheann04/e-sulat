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
  theme?: string;
  font?: string;
  photos?: string[]; // Array of base64 encoded images
}

const themes = [
  { name: 'Default', color: '#ffffff' },
  { name: 'Light Blue', color: '#e0f2fe' },
  { name: 'Light Green', color: '#f0fdf4' },
  { name: 'Light Pink', color: '#fdf2f8' },
  { name: 'Light Yellow', color: '#fffbeb' },
  { name: 'Light Purple', color: '#f3e8ff' },
  { name: 'Light Orange', color: '#fff7ed' },
  { name: 'Light Cyan', color: '#ecfeff' },
  { name: 'Light Gray', color: '#f9fafb' },
  { name: 'Warm White', color: '#fefce8' },
  { name: 'Cool Gray', color: '#f8fafc' },
  { name: 'Mint', color: '#f0fdfa' },
];

const fonts = [
  { name: 'Arial', family: 'Arial, sans-serif' },
  { name: 'Georgia', family: 'Georgia, serif' },
  { name: 'Times New Roman', family: '"Times New Roman", serif' },
  { name: 'Courier New', family: '"Courier New", monospace' },
  { name: 'Helvetica', family: 'Helvetica, sans-serif' },
  { name: 'Verdana', family: 'Verdana, sans-serif' },
];

export default function NotePage() {
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showFontModal, setShowFontModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const router = useRouter();
  const params = useParams();
  const noteId = params.id as string;
  const { t } = useLanguage();

  useEffect(() => {
    const loadNote = async () => {
      const allNotes = await StorageHelpers.getNotes();
      const currentNote = allNotes.find((n: Note) => n.id === noteId);
      if (currentNote) {
        setNote(currentNote);
        setTitle(currentNote.title);
        setContent(currentNote.content);
        setPhotos(currentNote.photos || []);
      }
    };
    
    loadNote();
  }, [noteId]);

  const saveNote = async () => {
    if (!note) return;
    
    const allNotes = await StorageHelpers.getNotes();
    const updatedNotes = allNotes.map((n: Note) => 
      n.id === noteId 
        ? { ...n, title, content, theme: note.theme, font: note.font, photos }
        : n
    );
    
    await StorageHelpers.setNotes(updatedNotes);
  };

  const handleThemeChange = async (theme: string) => {
    if (note) {
      const updatedNote = { ...note, theme };
      setNote(updatedNote);
      
      // Save immediately with the new theme
      const allNotes = await StorageHelpers.getNotes();
      const updatedNotes = allNotes.map((n: Note) => 
        n.id === noteId 
          ? { ...n, title, content, theme, font: note.font, photos }
          : n
      );
      
      await StorageHelpers.setNotes(updatedNotes);
    }
    setShowThemeModal(false);
  };

  const handleFontChange = async (font: string) => {
    if (note) {
      const updatedNote = { ...note, font };
      setNote(updatedNote);
      
      // Save immediately with the new font
      const allNotes = await StorageHelpers.getNotes();
      const updatedNotes = allNotes.map((n: Note) => 
        n.id === noteId 
          ? { ...n, title, content, theme: note.theme, font, photos }
          : n
      );
      
      await StorageHelpers.setNotes(updatedNotes);
    }
    setShowFontModal(false);
  };

  const handleSave = async () => {
    await saveNote();
    router.back();
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          if (result) {
            setPhotos(prev => [...prev, result]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
    
    // Reset the input
    event.target.value = '';
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setSelectedPhotoIndex(null);
  };



  if (!note) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 flex items-center justify-center">
        <div className="text-white text-xl">{t('common.loading')}</div>
      </div>
    );
  }

  const currentTheme = themes.find(t => t.color === note.theme) || themes[0];
  const currentFont = fonts.find(f => f.family === note.font) || fonts[0];

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
          onClick={handleSave}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          ←
        </button>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 text-xl font-bold bg-transparent border-none outline-none"
          placeholder={t('folder.noteTitle')}
        />
      </header>

      {/* Content Area */}
      <main 
        className="relative z-10 p-4 min-h-[calc(100vh-140px)]"
        style={{ 
          backgroundColor: currentTheme.color,
          fontFamily: currentFont.family 
        }}
      >
        <div className="w-full h-full min-h-[400px] space-y-4">
          {/* Content Editor */}
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t('folder.whatsOnMind')}
              className="w-full h-full min-h-[300px] bg-transparent border-none outline-none resize-none text-gray-800 relative z-10"
              style={{ fontFamily: currentFont.family }}
            />
          </div>
          
          {/* Photo Gallery */}
          {photos.length > 0 && (
            <div className="mt-4 space-y-3">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Photos</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => setSelectedPhotoIndex(index)}
                    />
                    <button
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Actions */}
      <div className="fixed bottom-4 left-4 right-4 flex gap-3 z-20">
        <button
          onClick={() => setShowThemeModal(true)}
          className="flex-1 bg-white/20 backdrop-blur-sm text-white py-3 px-4 rounded-xl font-semibold shadow-lg border border-white/30 hover:bg-white/30 transition-all duration-300 flex items-center justify-center gap-2 group"
        >
          <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
          </svg>
          Theme
        </button>
        <button
          onClick={() => setShowFontModal(true)}
          className="flex-1 bg-white/20 backdrop-blur-sm text-white py-3 px-4 rounded-xl font-semibold shadow-lg border border-white/30 hover:bg-white/30 transition-all duration-300 flex items-center justify-center gap-2 group"
        >
          <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Font
        </button>
        <button
          onClick={() => setShowImageModal(true)}
          className={`flex-1 bg-white/20 backdrop-blur-sm text-white py-3 px-4 rounded-xl font-semibold shadow-lg border border-white/30 hover:bg-white/30 transition-all duration-300 flex items-center justify-center gap-2 group relative ${
            photos.length > 0 ? 'ring-2 ring-blue-400/50' : ''
          }`}
        >
          <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Photos
          {photos.length > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center font-bold">
              {photos.length}
            </span>
          )}
        </button>
      </div>

      {/* Theme Modal */}
      {showThemeModal && (
        <Modal onClose={() => setShowThemeModal(false)}>
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Choose Theme</h2>
            <p className="text-white/80 text-sm">Select a background color for your note</p>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mb-6 max-h-80 overflow-y-auto">
            {themes.map((theme) => {
              const isSelected = currentTheme.color === theme.color;
              return (
                <button
                  key={theme.name}
                  onClick={() => handleThemeChange(theme.color)}
                  className={`relative p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-3 group hover:scale-105 ${
                    isSelected 
                      ? 'border-blue-400 shadow-lg shadow-blue-400/30 bg-white/20' 
                      : 'border-white/30 hover:border-white/50 bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  
                  <div 
                    className="w-12 h-12 rounded-xl border-2 border-gray-300 shadow-md group-hover:shadow-lg transition-shadow"
                    style={{ backgroundColor: theme.color }}
                  ></div>
                  
                  <span className="text-sm font-semibold text-white group-hover:text-blue-200 transition-colors">
                    {theme.name}
                  </span>
                </button>
              );
            })}
          </div>
        </Modal>
      )}

      {/* Font Modal */}
      {showFontModal && (
        <Modal onClose={() => setShowFontModal(false)}>
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Choose Font</h2>
            <p className="text-white/80 text-sm">Select a font family for your note</p>
          </div>
          
          <div className="space-y-3 mb-6 max-h-80 overflow-y-auto">
            {fonts.map((font) => {
              const isSelected = currentFont.family === font.family;
              return (
                <button
                  key={font.name}
                  onClick={() => handleFontChange(font.family)}
                  className={`w-full p-4 text-left rounded-2xl border-2 transition-all duration-300 group hover:scale-[1.02] ${
                    isSelected 
                      ? 'border-blue-400 shadow-lg shadow-blue-400/30 bg-white/20' 
                      : 'border-white/30 hover:border-white/50 bg-white/10 hover:bg-white/20'
                  }`}
                  style={{ fontFamily: font.family }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white mb-1">{font.name}</div>
                      <div className="text-white/80 text-sm truncate" style={{ fontFamily: font.family }}>
                        The quick brown fox jumps over the lazy dog
                      </div>
                    </div>
                    
                    {isSelected && (
                      <div className="ml-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </Modal>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <Modal onClose={() => setShowImageModal(false)}>
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Add Photos</h2>
            <p className="text-white/80 text-sm">Upload images to your note</p>
          </div>

          <div className="space-y-4">
            {/* Upload Button */}
            <label className="block">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <div className="w-full p-6 border-2 border-dashed border-white/30 rounded-xl hover:border-white/50 hover:bg-white/10 transition-all duration-200 cursor-pointer text-center">
                <svg className="w-12 h-12 mx-auto mb-3 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <p className="text-white font-medium mb-1">Click to upload photos</p>
                <p className="text-white/70 text-sm">Support JPG, PNG, GIF files</p>
              </div>
            </label>

            {/* Current Photos */}
            {photos.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-white font-semibold">Current Photos ({photos.length})</h3>
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setSelectedPhotoIndex(index)}
                      />
                      <button
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        Photo {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setShowImageModal(false)}
              className="w-full py-3 px-4 bg-white/20 hover:bg-white/30 text-white rounded-xl font-medium transition-all duration-200 border border-white/30"
            >
              Done
            </button>
          </div>
        </Modal>
      )}

      {/* Photo Viewer Modal */}
      {selectedPhotoIndex !== null && (
        <Modal onClose={() => setSelectedPhotoIndex(null)}>
          <div className="text-center">
            <img
              src={photos[selectedPhotoIndex]}
              alt={`Photo ${selectedPhotoIndex + 1}`}
              className="max-w-full max-h-96 mx-auto rounded-lg shadow-lg mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => handleRemovePhoto(selectedPhotoIndex)}
                className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
              >
                Delete Photo
              </button>
              <button
                onClick={() => setSelectedPhotoIndex(null)}
                className="flex-1 py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}


    </div>
  );
}