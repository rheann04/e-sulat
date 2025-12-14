'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Modal from '../../components/Modal';
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
}

const themes = [
  { name: 'Default', color: '#ffffff' },
  { name: 'Light Blue', color: '#e0f2fe' },
  { name: 'Light Green', color: '#f0fdf4' },
  { name: 'Light Pink', color: '#fdf2f8' },
  { name: 'Light Yellow', color: '#fffbeb' },
  { name: 'Light Purple', color: '#f3e8ff' },
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
  const router = useRouter();
  const params = useParams();
  const noteId = params.id as string;

  useEffect(() => {
    const loadNote = async () => {
      const allNotes = await StorageHelpers.getNotes();
      const currentNote = allNotes.find((n: Note) => n.id === noteId);
      if (currentNote) {
        setNote(currentNote);
        setTitle(currentNote.title);
        setContent(currentNote.content);
      }
    };
    
    loadNote();
  }, [noteId]);

  const saveNote = async () => {
    if (!note) return;
    
    const allNotes = await StorageHelpers.getNotes();
    const updatedNotes = allNotes.map((n: Note) => 
      n.id === noteId 
        ? { ...n, title, content, theme: note.theme, font: note.font }
        : n
    );
    
    await StorageHelpers.setNotes(updatedNotes);
  };

  const handleThemeChange = async (theme: string) => {
    if (note) {
      const updatedNote = { ...note, theme };
      setNote(updatedNote);
      await saveNote();
    }
    setShowThemeModal(false);
  };

  const handleFontChange = async (font: string) => {
    if (note) {
      const updatedNote = { ...note, font };
      setNote(updatedNote);
      await saveNote();
    }
    setShowFontModal(false);
  };

  const handleSave = async () => {
    await saveNote();
    router.back();
  };

  if (!note) {
    return (
      <div className="min-h-screen bg-yellow-400 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const currentTheme = themes.find(t => t.color === note.theme) || themes[0];
  const currentFont = fonts.find(f => f.family === note.font) || fonts[0];

  return (
    <div className="min-h-screen bg-yellow-400">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex items-center gap-3">
        <button
          onClick={handleSave}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          ←
        </button>
        <img
          src="/logo.png"
          alt="E-Sulat Logo"
          className="w-8 h-8 rounded-full"
        />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 text-xl font-bold bg-transparent border-none outline-none"
          placeholder="Note title"
        />
      </header>

      {/* Content Area */}
      <main 
        className="p-4 min-h-[calc(100vh-140px)]"
        style={{ 
          backgroundColor: currentTheme.color,
          fontFamily: currentFont.family 
        }}
      >
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your note..."
          className="w-full h-full min-h-[400px] bg-transparent border-none outline-none resize-none text-gray-800"
          style={{ fontFamily: currentFont.family }}
        />
      </main>

      {/* Bottom Actions */}
      <div className="fixed bottom-4 left-4 right-4 flex gap-4">
        <button
          onClick={() => setShowThemeModal(true)}
          className="flex-1 bg-white text-gray-800 py-3 px-4 rounded-lg font-semibold shadow-lg"
        >
          Theme
        </button>
        <button
          onClick={() => setShowFontModal(true)}
          className="flex-1 bg-white text-gray-800 py-3 px-4 rounded-lg font-semibold shadow-lg"
        >
          Fonts
        </button>
        <button
          onClick={() => setShowImageModal(true)}
          className="flex-1 bg-white text-gray-800 py-3 px-4 rounded-lg font-semibold shadow-lg"
        >
          Image
        </button>
      </div>

      {/* Theme Modal */}
      {showThemeModal && (
        <Modal onClose={() => setShowThemeModal(false)}>
          <h2 className="text-xl font-bold mb-4">Choose Theme</h2>
          <div className="grid grid-cols-2 gap-3">
            {themes.map((theme) => (
              <button
                key={theme.name}
                onClick={() => handleThemeChange(theme.color)}
                className="p-4 rounded-lg border-2 hover:border-blue-500 flex flex-col items-center gap-2"
                style={{ backgroundColor: theme.color }}
              >
                <div 
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: theme.color }}
                ></div>
                <span className="text-sm font-medium">{theme.name}</span>
              </button>
            ))}
          </div>
        </Modal>
      )}

      {/* Font Modal */}
      {showFontModal && (
        <Modal onClose={() => setShowFontModal(false)}>
          <h2 className="text-xl font-bold mb-4">Choose Font</h2>
          <div className="space-y-2">
            {fonts.map((font) => (
              <button
                key={font.name}
                onClick={() => handleFontChange(font.family)}
                className="w-full p-3 text-left rounded-lg hover:bg-gray-100 border"
                style={{ fontFamily: font.family }}
              >
                {font.name} - Sample text
              </button>
            ))}
          </div>
        </Modal>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <Modal onClose={() => setShowImageModal(false)}>
          <h2 className="text-xl font-bold mb-4">Add Image</h2>
          <p className="text-gray-600 mb-4">Image functionality coming soon!</p>
          <button
            onClick={() => setShowImageModal(false)}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Close
          </button>
        </Modal>
      )}
    </div>
  );
}