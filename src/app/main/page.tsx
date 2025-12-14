'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import Header from '../components/Header';
import { StorageHelpers } from '../utils/storage';

interface Folder {
  id: string;
  name: string;
  createdAt: Date;
}

export default function MainPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [folders, setFolders] = useState<Folder[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadFolders = async () => {
      const savedFolders = await StorageHelpers.getFolders();
      setFolders(savedFolders);
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
      setFolders(updatedFolders);
      await StorageHelpers.setFolders(updatedFolders);
      setFolderName('');
      setShowNewFolderModal(false);
    }
  };

  const handleFolderClick = (folderId: string) => {
    router.push(`/folder/${folderId}`);
  };

  return (
    <div className="min-h-screen bg-yellow-400">
      {/* Header */}
      <Header onMenuClick={() => setSidebarOpen(true)} />

      {/* Main Content */}
      <main className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {folders.map((folder) => (
            <div
              key={folder.id}
              onClick={() => handleFolderClick(folder.id)}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center">
                  <span className="text-white text-sm">📁</span>
                </div>
                <h3 className="font-semibold text-gray-800 truncate">{folder.name}</h3>
              </div>
              <p className="text-xs text-gray-500">
                Created {new Date(folder.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Buttons */}
      <div className="fixed bottom-4 left-4 right-4 flex gap-4">
        <button className="flex-1 bg-white text-gray-800 py-3 px-4 rounded-lg font-semibold shadow-lg">
          ALL
        </button>
        <button
          onClick={() => setShowNewFolderModal(true)}
          className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:bg-blue-600"
        >
          NEW FOLDER
        </button>
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <Modal onClose={() => setShowNewFolderModal(false)}>
          <h2 className="text-xl font-bold mb-4">Create New Folder</h2>
          <input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Enter folder name"
            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={() => setShowNewFolderModal(false)}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateFolder}
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