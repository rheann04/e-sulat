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
import { useLanguage } from '../contexts/LanguageContext';

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
  const [folderNameError, setFolderNameError] = useState('');
  const router = useRouter();
  const { t } = useLanguage();

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
    const trimmedName = folderName.trim();
    if (trimmedName) {
      // Check for duplicate folder names (case-insensitive)
      const existingFolder = folders.find(folder => 
        folder.name.toLowerCase() === trimmedName.toLowerCase()
      );
      
      if (existingFolder) {
        setFolderNameError(t('error.duplicateFolder'));
        return;
      }
      
      const newFolder: Folder = {
        id: Date.now().toString(),
        name: trimmedName,
        createdAt: new Date()
      };
      const updatedFolders = [...folders, newFolder];
      // Sort folders alphabetically by name
      const sortedFolders = updatedFolders.sort((a: Folder, b: Folder) => a.name.localeCompare(b.name));
      setFolders(sortedFolders);
      await StorageHelpers.setFolders(sortedFolders);
      setFolderName('');
      setFolderNameError('');
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
    const trimmedName = folderName.trim();
    if (selectedFolder && trimmedName) {
      // Check for duplicate folder names (case-insensitive), excluding current folder
      const existingFolder = folders.find(folder => 
        folder.id !== selectedFolder.id && 
        folder.name.toLowerCase() === trimmedName.toLowerCase()
      );
      
      if (existingFolder) {
        setFolderNameError(t('error.duplicateFolder'));
        return;
      }
      
      const updatedFolders = folders.map(folder =>
        folder.id === selectedFolder.id
          ? { ...folder, name: trimmedName }
          : folder
      );
      // Sort folders alphabetically by name
      const sortedFolders = updatedFolders.sort((a: Folder, b: Folder) => a.name.localeCompare(b.name));
      setFolders(sortedFolders);
      await StorageHelpers.setFolders(sortedFolders);
      setFolderName('');
      setFolderNameError('');
      setSelectedFolder(null);
      setShowEditFolderModal(false);
    }
  };

  const handleFolderNameChange = (value: string) => {
    setFolderName(value);
    if (folderNameError) {
      setFolderNameError('');
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
            title={t('main.noFolders')}
            description={t('main.noFoldersDesc')}
            actionLabel={t('main.createFirstFolder')}
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
          <div className="py-6">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">📁</div>
              <h2 className="font-heading text-xl font-semibold text-white mb-2">{t('main.newFolder')}</h2>
            </div>
            <div className="mb-8">
              <Input
                value={folderName}
                onChange={(e) => handleFolderNameChange(e.target.value)}
                placeholder={t('main.folderName')}
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                className="text-base p-3"
              />
              {folderNameError && (
                <p className="text-red-300 text-sm mt-2 font-medium">{folderNameError}</p>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="md"
                fullWidth
                onClick={() => setShowNewFolderModal(false)}
              >
                {t('main.cancel')}
              </Button>
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={handleCreateFolder}
                disabled={!folderName.trim()}
              >
                {t('main.create')}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Folder Modal */}
      {showEditFolderModal && selectedFolder && (
        <Modal onClose={() => {
          setShowEditFolderModal(false);
          setSelectedFolder(null);
          setFolderName('');
          setFolderNameError('');
        }}>
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">✏️</div>
            <h2 className="font-heading text-xl font-semibold text-white mb-2">{t('common.edit')} {t('main.folders')}</h2>
            <p className="font-body text-white/70 text-sm">{t('main.folderName')}</p>
          </div>
          <div className="mb-8">
            <Input
              value={folderName}
              onChange={(e) => handleFolderNameChange(e.target.value)}
              placeholder={t('main.folderName')}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleUpdateFolder()}
              className="text-base p-3"
            />
            {folderNameError && (
              <p className="text-red-300 text-sm mt-2 font-medium">{folderNameError}</p>
            )}
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
                setFolderNameError('');
              }}
            >
              {t('main.cancel')}
            </Button>
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={handleUpdateFolder}
              disabled={!folderName.trim()}
            >
              {t('common.save')}
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
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🗑️</div>
            <h2 className="font-heading text-xl font-semibold text-white mb-2">{t('common.delete')} {t('main.folders')}</h2>
            <p className="font-body text-white/70 text-sm mb-4">
              {t('trash.confirmDelete')} "{selectedFolder.name}"?
            </p>
            <p className="font-body text-red-300 text-sm font-medium">
              {t('trash.cannotUndo')}
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
              {t('main.cancel')}
            </Button>
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              {t('common.delete')}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}