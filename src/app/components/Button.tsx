'use client';

import { ReactNode } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  type = 'button'
}: ButtonProps) {
  const baseClasses = 'font-bold rounded-xl sm:rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed hover-lift active:scale-95 flex items-center justify-center gap-2 sm:gap-3 relative overflow-hidden backdrop-blur-xl touch-target';
  
  const variantClasses = {
    primary: 'bg-gradient-sunset text-white hover:shadow-glow-strong focus:ring-orange-400 disabled:bg-gray-300 shadow-glass-medium border border-white/20 disabled:opacity-50',
    secondary: 'glass-strong text-white border border-white/30 hover:bg-white/40 focus:ring-white/50 disabled:bg-gray-100 shadow-glass hover:shadow-glass-medium disabled:opacity-50',
    danger: 'bg-gradient-secondary text-white hover:shadow-glow-strong focus:ring-red-400 disabled:bg-gray-300 shadow-glass-medium border border-white/20 disabled:opacity-50',
    ghost: 'text-white hover:bg-white/20 focus:ring-white/50 disabled:text-gray-400 backdrop-blur-sm hover:backdrop-blur-xl disabled:opacity-50'
  };

  const sizeClasses = {
    sm: 'py-2 px-4 text-xs sm:py-2.5 sm:px-5 sm:text-sm',
    md: 'py-3 px-5 text-sm sm:py-4 sm:px-6 sm:text-base',
    lg: 'py-4 px-6 text-base sm:py-5 sm:px-8 sm:text-lg'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className} group`}
    >
      {loading && <LoadingSpinner size="sm" color={variant === 'primary' || variant === 'danger' ? 'white' : 'gray'} />}
      <span className={loading ? 'opacity-0' : 'opacity-100 transition-opacity'}>{children}</span>
      {!loading && variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
      )}
    </button>
  );
}