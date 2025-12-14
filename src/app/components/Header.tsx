'use client';

import Image from 'next/image';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="E-Sulat Logo"
          width={32}
          height={32}
          className="rounded-full"
        />
        <h1 className="text-xl font-bold text-gray-800">E-SULAT</h1>
      </div>
      <button
        onClick={onMenuClick}
        className="p-2 hover:bg-gray-100 rounded-lg"
      >
        <div className="w-6 h-6 flex flex-col justify-center gap-1">
          <div className="w-full h-0.5 bg-gray-600"></div>
          <div className="w-full h-0.5 bg-gray-600"></div>
          <div className="w-full h-0.5 bg-gray-600"></div>
        </div>
      </button>
    </header>
  );
}