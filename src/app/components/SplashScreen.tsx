'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300); // Wait for fade out animation
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) {
    return (
      <div className="fixed inset-0 bg-yellow-400 flex items-center justify-center z-50 transition-opacity duration-300 opacity-0 pointer-events-none">
        <div className="text-center">
          <div className="mb-6">
            <Image
              src="/logo.png"
              alt="E-Sulat Logo"
              width={120}
              height={120}
              className="mx-auto"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-800">E-SULAT</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-yellow-400 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="text-center">
        <div className="mb-6">
          <Image
            src="/logo.png"
            alt="E-Sulat Logo"
            width={120}
            height={120}
            className="mx-auto"
          />
        </div>
        <h1 className="text-4xl font-bold text-gray-800">E-SULAT</h1>
      </div>
    </div>
  );
}