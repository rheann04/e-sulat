'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import Header from '../components/Header';
import FolderCard from '../components/FolderCard';
import EmptyState from '../components/EmptyState';
import FloatingActionButtons from '../components/FloatingActionButtons';
import Button from '../components/Button';
import Input from '../components/Input';
import { StorageHelpers } from '../utils/storage';

interface Folder {
  id: string;
  name: string;
  createdAt: Date;
}

interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
  createdAt: Date;
  status: 'pending' | 'completed';
  photos?: string[]; // Array of base64 encoded images
}

interface TrashedItem {
  id: string;
  type: 'note' | 'folder';
  data: Note | Folder;
  deletedAt: Date;
}

export default function MainPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [showEditFolderModal, setShowEditFolderModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadFolders = async () => {
      const savedFolders = await StorageHelpers.getFolders();
      // Sort folders alphabetically by name
      const sortedFolders = savedFolders.sort((a: Folder, b: Folder) => a.name.localeCompare(b.name));
      setFolders(sortedFolders);
    };
    
    loadFolders();
  }, []);

  const handleCreateFolder = async () => {
    if (folderName.trim()) {
      const newFolder: Folder = {
        id: Date.now().toString(),
        name: folderName.trim(),
        createdAt: new Date()
      };
      const updatedFolders = [...folders, newFolder];
      // Sort folders alphabetically by name
      const sortedFolders = updatedFolders.sort((a: Folder, b: Folder) => a.name.localeCompare(b.name));
      setFolders(sortedFolders);
      await StorageHelpers.setFolders(sortedFolders);
      setFolderName('');
      setShowNewFolderModal(false);
    }
  };

  const handleFolderClick = (folderId: string) => {
    router.push(`/folder/${folderId}`);
  };

  const handleEditFolder = (folder: Folder) => {
    setSelectedFolder(folder);
    setFolderName(folder.name);
    setShowEditFolderModal(true);
  };

  const handleDeleteFolder = (folderId: string) => {
    const folder = folders.find(f => f.id === folderId);
    if (folder) {
      setSelectedFolder(folder);
      setShowDeleteConfirmModal(true);
    }
  };

  const handleUpdateFolder = async () => {
    if (selectedFolder && folderName.trim()) {
      const updatedFolders = folders.map(folder =>
        folder.id === selectedFolder.id
          ? { ...folder, name: folderName.trim() }
          : folder
      );
      // Sort folders alphabetically by name
      const sortedFolders = updatedFolders.sort((a: Folder, b: Folder) => a.name.localeCompare(b.name));
      setFolders(sortedFolders);
      await StorageHelpers.setFolders(sortedFolders);
      setFolderName('');
      setSelectedFolder(null);
      setShowEditFolderModal(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedFolder) {
      // Remove folder from folders list
      const updatedFolders = folders.filter(folder => folder.id !== selectedFolder.id);
      setFolders(updatedFolders);
      await StorageHelpers.setFolders(updatedFolders);
      
      // Move folder to trash
      const savedTrashedItems = localStorage.getItem('trashedItems');
      const trashedItems = savedTrashedItems ? JSON.parse(savedTrashedItems) : [];
      
      const trashedFolder = {
        id: selectedFolder.id,
        type: 'folder' as const,
        data: selectedFolder,
        deletedAt: new Date()
      };
      
      trashedItems.push(trashedFolder);
      localStorage.setItem('trashedItems', JSON.stringify(trashedItems));
      
      // Also move all notes in this folder to trash
      const savedNotes = await StorageHelpers.getNotes();
      const notesInFolder = savedNotes.filter((note: any) => note.folderId === selectedFolder.id);
      const updatedNotes = savedNotes.filter((note: any) => note.folderId !== selectedFolder.id);
      await StorageHelpers.setNotes(updatedNotes);
      
      // Add notes to trash as well
      if (notesInFolder.length > 0) {
        const trashedNotes = notesInFolder.map((note: any) => ({
          id: note.id,
          type: 'note' as const,
          data: note,
          deletedAt: new Date()
        }));
        
        const updatedTrashedItems = [...trashedItems, ...trashedNotes];
        localStorage.setItem('trashedItems', JSON.stringify(updatedTrashedItems));
      }
      
      setSelectedFolder(null);
      setShowDeleteConfirmModal(false);
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
      <Header onMenuClick={() => setSidebarOpen(true)} />

      {/* Main Content */}
      <main className="relative z-10 container-responsive spacing-responsive pb-24 sm:pb-28 lg:pb-32">
        {folders.length === 0 ? (
          <EmptyState
            icon=""
            title="No folders yet"
            description="Create your first folder to start organizing your notes and ideas."
            actionLabel="Create First Folder"
            onAction={() => setShowNewFolderModal(true)}
          />
        ) : (
          <div className="space-y-4 sm:space-y-5 lg:space-y-6 animate-fade-in">
            {folders.map((folder, index) => (
              <div 
                key={folder.id} 
                className="animate-slide-in-right"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <FolderCard
                  folder={folder}
                  onClick={handleFolderClick}
                  onEdit={handleEditFolder}
                  onDelete={handleDeleteFolder}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Buttons */}
      <FloatingActionButtons
        onAllNotes={() => {/* TODO: Navigate to all notes */}}
        onNewFolder={() => setShowNewFolderModal(true)}
      />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <Modal onClose={() => setShowNewFolderModal(false)}>
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">📁</div>
            <h2 className="text-xl font-semibold text-white mb-2">New Folder</h2>
            <p className="text-white/70 text-sm">Enter a name for your folder</p>
          </div>
          <div className="mb-6">
            <Input
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Folder name"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
              className="text-base p-3"
            />
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => setShowNewFolderModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={handleCreateFolder}
              disabled={!folderName.trim()}
            >
              Create
            </Button>
          </div>
        </Modal>
      )}

      {/* Edit Folder Modal */}
      {showEditFolderModal && selectedFolder && (
        <Modal onClose={() => {
          setShowEditFolderModal(false);
          setSelectedFolder(null);
          setFolderName('');
        }}>
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">✏️</div>
            <h2 className="text-xl font-semibold text-white mb-2">Edit Folder</h2>
            <p className="text-white/70 text-sm">Update the folder name</p>
          </div>
          <div className="mb-6">
            <Input
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Folder name"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleUpdateFolder()}
              className="text-base p-3"
            />
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => {
                setShowEditFolderModal(false);
                setSelectedFolder(null);
                setFolderName('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={handleUpdateFolder}
              disabled={!folderName.trim()}
            >
              Update
            </Button>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && selectedFolder && (
        <Modal onClose={() => {
          setShowDeleteConfirmModal(false);
          setSelectedFolder(null);
        }}>
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🗑️</div>
            <h2 className="text-xl font-semibold text-white mb-2">Delete Folder</h2>
            <p className="text-white/70 text-sm mb-4">
              Are you sure you want to delete "{selectedFolder.name}"?
            </p>
            <p className="text-red-300 text-sm font-medium">
              This will also delete all notes inside this folder.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => {
                setShowDeleteConfirmModal(false);
                setSelectedFolder(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}