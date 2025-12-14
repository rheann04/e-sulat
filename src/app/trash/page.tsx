'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
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

interface Folder {
  id: string;
  name: string;
  createdAt: Date;
}

interface TrashedItem {
  id: string;
  type: 'note' | 'folder';
  data: Note | Folder;
  deletedAt: Date;
}

export default function TrashPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useLanguage();
  const [trashedItems, setTrashedItems] = useState<TrashedItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<TrashedItem | null>(null);
  const [showEmptyTrashModal, setShowEmptyTrashModal] = useState(false);

  useEffect(() => {
    const savedTrashedItems = localStorage.getItem('trashedItems');
    if (savedTrashedItems) {
      const items: TrashedItem[] = JSON.parse(savedTrashedItems);
      // Auto-delete items older than 30 days
      const now = new Date();
      const validItems = items.filter(item => {
        const deletedDate = new Date(item.deletedAt);
        const daysDiff = Math.floor((now.getTime() - deletedDate.getTime()) / (1000 * 60 * 60 * 24));
        return daysDiff < 30;
      });
      
      if (validItems.length !== items.length) {
        localStorage.setItem('trashedItems', JSON.stringify(validItems));
      }
      
      setTrashedItems(validItems);
    }
  }, []);

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleRestore = async () => {
    const itemsToRestore = trashedItems.filter(item => selectedItems.includes(item.id));
    const remainingTrashed = trashedItems.filter(item => !selectedItems.includes(item.id));
    
    // Restore notes
    const notesToRestore = itemsToRestore.filter(item => item.type === 'note').map(item => item.data as Note);
    if (notesToRestore.length > 0) {
      const allNotes = await StorageHelpers.getNotes();
      await StorageHelpers.setNotes([...allNotes, ...notesToRestore]);
    }
    
    // Restore folders
    const foldersToRestore = itemsToRestore.filter(item => item.type === 'folder').map(item => item.data as Folder);
    if (foldersToRestore.length > 0) {
      const allFolders = await StorageHelpers.getFolders();
      await StorageHelpers.setFolders([...allFolders, ...foldersToRestore]);
    }
    
    localStorage.setItem('trashedItems', JSON.stringify(remainingTrashed));
    setTrashedItems(remainingTrashed);
    setSelectedItems([]);
  };

  const handlePermanentDelete = () => {
    const remainingTrashed = trashedItems.filter(item => !selectedItems.includes(item.id));
    
    localStorage.setItem('trashedItems', JSON.stringify(remainingTrashed));
    setTrashedItems(remainingTrashed);
    setSelectedItems([]);
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleEmptyTrash = () => {
    localStorage.setItem('trashedItems', JSON.stringify([]));
    setTrashedItems([]);
    setSelectedItems([]);
    setShowEmptyTrashModal(false);
  };

  const handleSelectAll = () => {
    if (selectedItems.length === trashedItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(trashedItems.map(item => item.id));
    }
  };

  const getDaysRemaining = (deletedAt: Date) => {
    const now = new Date();
    const deletedDate = new Date(deletedAt);
    const daysPassed = Math.floor((now.getTime() - deletedDate.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, 30 - daysPassed);
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
        <h1 className="text-xl font-bold text-gray-800 text-center">{t('trash.title')}</h1>
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

      {/* Trash Info Bar */}
      {trashedItems.length > 0 && (
        <div className="bg-white/20 backdrop-blur-sm border-b border-white/30 p-4 flex justify-between items-center relative z-10">
          <p className="text-sm text-gray-700">
{t('trash.autoDelete')}
          </p>
          <button
            onClick={() => setShowEmptyTrashModal(true)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            {t('trash.emptyTrash')}
          </button>
        </div>
      )}

      {/* Select All Button */}
      {trashedItems.length > 0 && (
        <div className="bg-white/20 backdrop-blur-sm border-b border-white/30 p-4 relative z-10">
          <button
            onClick={handleSelectAll}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
          >
            {selectedItems.length === trashedItems.length ? t('folder.unselectAll') : t('folder.selectAll')}
          </button>
        </div>
      )}



      {/* Main Content */}
      <main className="relative z-10 p-4">
        {trashedItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Trash is empty</h3>
            <p className="text-gray-600">Deleted items will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {trashedItems
              .sort((a, b) => new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime())
              .map((item) => {
                const daysRemaining = getDaysRemaining(item.deletedAt);
                const isNote = item.type === 'note';
                const data = item.data as Note | Folder;
                const title = isNote ? (data as Note).title : (data as Folder).name;
                
                return (
                  <div
                    key={item.id}
                    className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30 transition-all hover:bg-white/30 flex items-center gap-3"
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="w-5 h-5 rounded border-2 border-gray-400 text-blue-500 focus:ring-blue-500 focus:ring-2"
                    />
                    
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-gray-400 to-gray-500 text-white shadow-md">
                      {isNote ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate">{title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <span className="capitalize">{item.type}</span>
                        <span>•</span>
                        <span>Deleted {new Date(item.deletedAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className={`font-medium ${daysRemaining <= 7 ? 'text-red-600' : 'text-gray-600'}`}>
                          {daysRemaining} days left
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          setSelectedItems([item.id]);
                          await handleRestore();
                        }}
                        className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50/20 rounded-lg transition-all"
                        title="Restore"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          setItemToDelete(item);
                          setSelectedItems([item.id]);
                          setShowDeleteModal(true);
                        }}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50/20 rounded-lg transition-all"
                        title="Delete Permanently"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                  </div>
                );
              })}
          </div>
        )}
      </main>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && itemToDelete && (
        <Modal onClose={() => {
          setShowDeleteModal(false);
          setItemToDelete(null);
        }}>
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{t('trash.permanentDelete')}</h2>
              <p className="text-white/80">
                {t('trash.confirmDelete')} "{itemToDelete.type === 'note' ? (itemToDelete.data as Note).title : (itemToDelete.data as Folder).name}"? 
                {t('trash.cannotUndo')}
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setItemToDelete(null);
                }}
                className="flex-1 py-3 px-4 bg-white/20 text-white border border-white/30 rounded-xl hover:bg-white/30 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handlePermanentDelete}
                className="flex-1 py-3 px-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all font-medium"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Empty Trash Confirmation Modal */}
      {showEmptyTrashModal && (
        <Modal onClose={() => setShowEmptyTrashModal(false)}>
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{t('trash.emptyTrash')}</h2>
              <p className="text-white/80">
                {t('trash.confirmEmptyTrash')} {trashedItems.length} {t('trash.itemsInTrash')}? 
                {t('trash.cannotUndo')}
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowEmptyTrashModal(false)}
                className="flex-1 py-3 px-4 bg-white/20 text-white border border-white/30 rounded-xl hover:bg-white/30 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleEmptyTrash}
                className="flex-1 py-3 px-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all font-medium"
              >
{t('trash.emptyTrash')}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}