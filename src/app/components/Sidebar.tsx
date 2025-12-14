'use client';

import { useRouter } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  const handleExit = () => {
    router.push('/');
    onClose();
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">MENU</h2>
          
          <nav className="space-y-2">
            <button
              onClick={() => handleNavigation('/main')}
              className="w-full text-left p-3 hover:bg-gray-100 rounded-lg font-medium"
            >
              Notes (Main Page)
            </button>
            <button
              onClick={() => handleNavigation('/reminder')}
              className="w-full text-left p-3 hover:bg-gray-100 rounded-lg font-medium"
            >
              Reminder
            </button>
            <button
              onClick={() => handleNavigation('/settings')}
              className="w-full text-left p-3 hover:bg-gray-100 rounded-lg font-medium"
            >
              Settings
            </button>
            <button
              onClick={() => handleNavigation('/archive')}
              className="w-full text-left p-3 hover:bg-gray-100 rounded-lg font-medium"
            >
              Archive
            </button>
            <button
              onClick={() => handleNavigation('/trash')}
              className="w-full text-left p-3 hover:bg-gray-100 rounded-lg font-medium"
            >
              Trash
            </button>
          </nav>
          
          <div className="absolute bottom-4 left-4 right-4">
            <button
              onClick={handleExit}
              className="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-600"
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}