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
    <div className="fixed inset-0 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 flex items-center justify-center z-50 transition-opacity duration-300 overflow-hidden">
      {/* Enhanced Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-pink-300/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-300/20 to-cyan-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-gradient-to-br from-yellow-200/10 to-orange-300/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-green-300/15 to-teal-400/15 rounded-full blur-2xl animate-float" style={{animationDelay: '3s'}}></div>
      </div>

      <div className="text-center animate-fade-in relative z-10">
        <div className="mb-12">
          <div className="w-40 h-40 mx-auto relative group">
            <div className="w-full h-full rounded-3xl bg-gradient-warm shadow-glow-warm animate-glow flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Image
                src="/logo.png"
                alt="E-Sulat Logo"
                width={120}
                height={120}
                className="rounded-2xl"
              />
            </div>
            <div className="absolute inset-0 rounded-3xl bg-gradient-accent opacity-20 animate-pulse"></div>
          </div>
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-white drop-shadow-lg tracking-wide mb-4">
          E-SULAT
        </h1>
        <p className="text-white/90 mt-4 text-xl drop-shadow-md font-medium">Your Digital Notebook</p>
        <div className="mt-12">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto shadow-glow"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-orange-300 rounded-full animate-spin mx-auto" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
}