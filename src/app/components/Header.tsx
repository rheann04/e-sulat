'use client';



interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="glass-strong border-b border-white/30 header-responsive flex justify-between items-center sticky top-0 z-40 shadow-glass-medium backdrop-blur-xl safe-area-padding">
      <div className="flex items-center gap-3 sm:gap-5">
        <div className="relative group">
          <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl bg-gradient-warm shadow-glow-warm flex items-center justify-center group-hover:scale-110 transition-all duration-300">
            <img
              src="/logo.png"
              alt="E-Sulat Logo"
              className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-lg sm:rounded-xl"
            />
          </div>
          <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-accent opacity-20 animate-pulse"></div>
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="font-heading text-lg sm:text-2xl lg:text-3xl font-bold text-white tracking-tight drop-shadow-lg truncate">
            E-SULAT
          </h1>
          <p className="font-accent text-white/70 text-xs sm:text-sm font-medium hidden sm:block italic">Digital Notebook</p>
        </div>
      </div>
      <button
        onClick={onMenuClick}
        className="touch-target p-3 sm:p-4 hover:bg-white/20 rounded-xl sm:rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 group shadow-glass hover:shadow-glass-medium hover-lift"
        aria-label="Open menu"
      >
        <div className="w-5 h-5 sm:w-6 sm:h-6 flex flex-col justify-center gap-1 sm:gap-1.5">
          <div className="w-full h-0.5 bg-white rounded-full transition-all duration-300 group-hover:bg-white/80 group-hover:w-4/5"></div>
          <div className="w-full h-0.5 bg-white rounded-full transition-all duration-300 group-hover:bg-white/80"></div>
          <div className="w-3/4 h-0.5 bg-white rounded-full transition-all duration-300 group-hover:bg-white/80 group-hover:w-full"></div>
        </div>
      </button>
    </header>
  );
}