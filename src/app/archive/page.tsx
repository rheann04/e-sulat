'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';

interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
  createdAt: Date;
  status: 'pending' | 'completed';
}

export default function ArchivePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [archivedNotes, setArchivedNotes] = useState<Note[]>([]);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const savedArchivedNotes = localStorage.getItem('archivedNotes');
    if (savedArchivedNotes) {
      setArchivedNotes(JSON.parse(savedArchivedNotes));
    }
  }, []);

  const handleSelectNote = (noteId: string) => {
    setSelectedNotes(prev => 
      prev.includes(noteId) 
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId]
    );
  };

  const handleUnarchive = () => {
    const savedNotes = localStorage.getItem('notes');
    const allNotes: Note[] = savedNotes ? JSON.parse(savedNotes) : [];
    
    const notesToUnarchive = archivedNotes.filter(note => selectedNotes.includes(note.id));
    const remainingArchived = archivedNotes.filter(note => !selectedNotes.includes(note.id));
    
    localStorage.setItem('notes', JSON.stringify([...allNotes, ...notesToUnarchive]));
    localStorage.setItem('archivedNotes', JSON.stringify(remainingArchived));
    
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
    <div className="min-h-screen bg-yellow-400">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            ←
          </button>
          <h1 className="text-xl font-bold text-gray-800">Archive</h1>
        </div>
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
        <div className="bg-white border-b p-4 flex gap-2">
          <button
            onClick={handleSelectAll}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium"
          >
            {selectedNotes.length === archivedNotes.length ? 'Unselect All' : 'Select All'}
          </button>
          <button
            onClick={handleUnarchive}
            className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium"
          >
            Unarchive
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="p-4">
        {archivedNotes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-600 text-lg">No archived notes</div>
          </div>
        ) : (
          <div className="space-y-3">
            {archivedNotes.map((note) => (
              <div
                key={note.id}
                className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-3"
              >
                <input
                  type="checkbox"
                  checked={selectedNotes.includes(note.id)}
                  onChange={() => handleSelectNote(note.id)}
                  className="rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{note.title}</h3>
                  <p className="text-sm text-gray-500">
                    Archived • {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
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