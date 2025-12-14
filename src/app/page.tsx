'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from './components/SplashScreen';
import { StorageHelpers } from './utils/storage';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  // Ensure we're on the client side to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
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
  }, [isClient]);

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

  // Use useEffect to handle navigation instead of during render
  useEffect(() => {
    if (isClient && !showSplash && !showWelcome) {
      router.push('/main');
    }
  }, [isClient, showSplash, showWelcome, router]);

  // Show loading state during hydration
  if (!isClient) {
    return <SplashScreen onComplete={() => {}} />;
  }

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (!showWelcome) {
    return null; // Show nothing while navigating
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 flex items-center justify-center spacing-responsive relative overflow-hidden safe-area-padding">
      {/* Enhanced Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-pink-300/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-blue-300/20 to-cyan-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/4 right-1/4 w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-gradient-to-br from-green-300/15 to-teal-400/15 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 sm:w-56 sm:h-56 lg:w-72 lg:h-72 bg-gradient-to-br from-indigo-300/15 to-purple-400/15 rounded-full blur-2xl animate-float" style={{animationDelay: '3s'}}></div>
      </div>

      <div className="glass-strong rounded-2xl sm:rounded-3xl shadow-glass-strong p-6 sm:p-8 lg:p-12 max-w-sm sm:max-w-md lg:max-w-lg w-full text-center animate-fade-in relative z-10 border border-white/30">
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <div className="relative inline-block mb-6 sm:mb-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-2xl sm:rounded-3xl bg-gradient-warm shadow-glow-warm flex items-center justify-center mx-auto animate-glow group">
              <img
                src="/logo.png"
                alt="E-Sulat Logo"
                className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-accent opacity-20 animate-pulse"></div>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 drop-shadow-lg tracking-wide">
            Welcome to E-Sulat
          </h1>
          <p className="text-white/90 text-base sm:text-lg lg:text-xl leading-relaxed drop-shadow-md font-medium">
            Your personal notes and notepad app. Create, organize, and manage your notes with ease. 
            Keep track of your thoughts, ideas, and reminders all in one place.
          </p>
        </div>
        
        <div className="mb-8 sm:mb-10">
          <label className="flex items-center justify-center gap-3 sm:gap-4 text-base sm:text-lg text-white/80 cursor-pointer hover:text-white transition-colors p-3 sm:p-4 rounded-xl sm:rounded-2xl hover:bg-white/10 group touch-target">
            <div className="relative flex-shrink-0">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 bg-white/20 border-white/30 rounded-lg focus:ring-blue-400 focus:ring-2 backdrop-blur-sm transition-all duration-300"
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-accent opacity-20 group-hover:opacity-30 transition-opacity"></div>
            </div>
            <span className="font-medium">Don't show me again</span>
          </label>
        </div>
        
        <button
          onClick={handleGetStarted}
          className="bg-gradient-sunset hover:shadow-glow-strong text-white font-bold touch-target py-4 sm:py-5 px-6 sm:px-8 rounded-xl sm:rounded-2xl w-full transition-all duration-300 hover-lift focus:outline-none focus:ring-4 focus:ring-orange-300/50 text-base sm:text-lg shadow-glass-medium border border-white/20 group"
        >
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <span>Get Started</span>
            <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}