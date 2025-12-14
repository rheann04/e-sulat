'use client';

import { forwardRef } from 'react';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'time' | 'datetime-local';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
  label?: string;
  error?: string;
  required?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  type = 'text',
  placeholder,
  value,
  onChange,
  onKeyDown,
  disabled = false,
  autoFocus = false,
  className = '',
  label,
  error,
  required = false
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-white mb-2 drop-shadow-md">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        required={required}
        className={`w-full p-3 sm:p-4 lg:p-5 glass-strong border border-white/30 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 disabled:bg-gray-100/20 disabled:cursor-not-allowed text-sm sm:text-base text-white placeholder-white/60 backdrop-blur-xl shadow-glass hover:shadow-glass-medium focus:shadow-glass-medium touch-target ${
          error 
            ? 'border-red-300 focus:ring-red-400' 
            : 'border-white/30 hover:border-white/40'
        } ${className}`}
      />
      {error && (
        <p className="mt-2 text-sm text-red-400 flex items-center gap-1 drop-shadow-md">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;