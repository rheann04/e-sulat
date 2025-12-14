'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Modal from '../../components/Modal';
import Header from '../../components/Header';
import { StorageHelpers } from '../../utils/storage';

interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
  createdAt: Date;
  status: 'pending' | 'completed';
  isSelected?: boolean;
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
  const router = useRouter();
  const params = useParams();
  const folderId = params.id as string;

  useEffect(() => {
    const loadData = async () => {
      // Load folder
      const savedFolders = await StorageHelpers.getFolders();
      const currentFolder = savedFolders.find((f: Folder) => f.id === folderId);
      setFolder(currentFolder || null);

      // Load notes
      const allNotes = await StorageHelpers.getNotes();
      setNotes(allNotes.filter((note: Note) => note.folderId === folderId));
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
      setNotes(prev => [...prev, newNote]);
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

  const handleSelectAll = () => {
    if (selectedNotes.length === filteredNotes.length) {
      setSelectedNotes([]);
      setShowActions(false);
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
    
    setNotes(remainingNotes.filter((note: Note) => note.folderId === folderId));
    setSelectedNotes([]);
    setShowActions(false);
  };

  const handleDelete = async () => {
    const allNotes = await StorageHelpers.getNotes();
    const trashed = await StorageHelpers.getTrashedNotes();
    
    const notesToTrash = allNotes.filter((note: Note) => selectedNotes.includes(note.id));
    const remainingNotes = allNotes.filter((note: Note) => !selectedNotes.includes(note.id));
    
    await StorageHelpers.setNotes(remainingNotes);
    await StorageHelpers.setTrashedNotes([...trashed, ...notesToTrash]);
    
    setNotes(remainingNotes.filter((note: Note) => note.folderId === folderId));
    setSelectedNotes([]);
    setShowActions(false);
  };

  return (
    <div className="min-h-screen bg-yellow-400">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            ←
          </button>
          <div className="flex items-center gap-3 flex-1">
            <img
              src="/logo.png"
              alt="E-Sulat Logo"
              className="w-8 h-8 rounded-full"
            />
            <h1 className="text-xl font-bold text-gray-800">{folder?.name || 'Folder'}</h1>
          </div>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            ALL
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            PENDING
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            COMPLETED
          </button>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex gap-2 mb-4">
            <button
              onClick={handleSelectAll}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium"
            >
              {selectedNotes.length === filteredNotes.length ? 'Unselect All' : 'Select All'}
            </button>
            <button
              onClick={handleArchive}
              className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium"
            >
              Archive
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium"
            >
              Delete
            </button>
          </div>
        )}
      </header>

      {/* Notes List */}
      <main className="p-4 pb-20">
        <div className="space-y-3">
          {filteredNotes.map((note) => (
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
              <div
                onClick={() => handleNoteClick(note.id)}
                className="flex-1 cursor-pointer"
              >
                <h3 className="font-semibold text-gray-800">{note.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(note.createdAt).toLocaleDateString()} • {note.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Add Note Button */}
      <button
        onClick={() => setShowNewNoteModal(true)}
        className="fixed bottom-4 right-4 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 flex items-center justify-center text-2xl"
      >
        +
      </button>

      {/* New Note Modal */}
      {showNewNoteModal && (
        <Modal onClose={() => setShowNewNoteModal(false)}>
          <h2 className="text-xl font-bold mb-4">Create New Note</h2>
          <input
            type="text"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            placeholder="Enter note title"
            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={() => setShowNewNoteModal(false)}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateNote}
              className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Create
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}