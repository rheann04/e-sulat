'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';

interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
  createdAt: Date;
  status: 'pending' | 'completed';
}

export default function TrashPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [trashedNotes, setTrashedNotes] = useState<Note[]>([]);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedTrashedNotes = localStorage.getItem('trashedNotes');
    if (savedTrashedNotes) {
      setTrashedNotes(JSON.parse(savedTrashedNotes));
    }
  }, []);

  const handleSelectNote = (noteId: string) => {
    setSelectedNotes(prev => 
      prev.includes(noteId) 
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId]
    );
  };

  const handleRestore = () => {
    const savedNotes = localStorage.getItem('notes');
    const allNotes: Note[] = savedNotes ? JSON.parse(savedNotes) : [];
    
    const notesToRestore = trashedNotes.filter(note => selectedNotes.includes(note.id));
    const remainingTrashed = trashedNotes.filter(note => !selectedNotes.includes(note.id));
    
    localStorage.setItem('notes', JSON.stringify([...allNotes, ...notesToRestore]));
    localStorage.setItem('trashedNotes', JSON.stringify(remainingTrashed));
    
    setTrashedNotes(remainingTrashed);
    setSelectedNotes([]);
  };

  const handlePermanentDelete = () => {
    const remainingTrashed = trashedNotes.filter(note => !selectedNotes.includes(note.id));
    
    localStorage.setItem('trashedNotes', JSON.stringify(remainingTrashed));
    
    setTrashedNotes(remainingTrashed);
    setSelectedNotes([]);
    setShowDeleteModal(false);
  };

  const handleSelectAll = () => {
    if (selectedNotes.length === trashedNotes.length) {
      setSelectedNotes([]);
    } else {
      setSelectedNotes(trashedNotes.map(note => note.id));
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
          <h1 className="text-xl font-bold text-gray-800">Trash</h1>
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
            {selectedNotes.length === trashedNotes.length ? 'Unselect All' : 'Select All'}
          </button>
          <button
            onClick={handleRestore}
            className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium"
          >
            Restore
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium"
          >
            Delete Permanently
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="p-4">
        {trashedNotes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-600 text-lg">Trash is empty</div>
          </div>
        ) : (
          <div className="space-y-3">
            {trashedNotes.map((note) => (
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
                    Deleted • {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Modal onClose={() => setShowDeleteModal(false)}>
          <h2 className="text-xl font-bold mb-4 text-red-600">Permanent Delete</h2>
          <p className="text-gray-600 mb-6">
            Are you sure you want to permanently delete {selectedNotes.length} note(s)? 
            This action cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handlePermanentDelete}
              className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Delete Permanently
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}