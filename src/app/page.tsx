'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from './components/SplashScreen';
import { StorageHelpers } from './utils/storage';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkWelcomeStatus = async () => {
      const hideWelcome = await StorageHelpers.getHideWelcome();
      if (hideWelcome) {
        // If user has chosen to skip welcome, go directly to main after splash
        setShowWelcome(false);
      } else {
        setShowWelcome(true);
      }
    };
    
    checkWelcomeStatus();
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    if (!showWelcome) {
      router.push('/main');
    }
  };

  const handleGetStarted = async () => {
    if (dontShowAgain) {
      await StorageHelpers.setHideWelcome(true);
    }
    router.push('/main');
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (!showWelcome) {
    router.push('/main');
    return null;
  }

  return (
    <div className="min-h-screen bg-yellow-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to E-Sulat</h1>
        <p className="text-gray-600 mb-6">
          Your personal notes and notepad app. Create, organize, and manage your notes with ease. 
          Keep track of your thoughts, ideas, and reminders all in one place.
        </p>
        
        <div className="mb-6">
          <label className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="rounded"
            />
            Don't show me again
          </label>
        </div>
        
        <button
          onClick={handleGetStarted}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg w-full transition-colors"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}