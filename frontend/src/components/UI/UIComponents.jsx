import React from 'react';

/**
 * GlassCard - A reusable semi-transparent card with backdrop blur.
 */
export const GlassCard = ({ children, className = '', ...props }) => (
  <div 
    className={`bg-[#1a1d27]/80 backdrop-blur-md border border-[#2a2f3e] rounded-2xl p-6 shadow-xl ${className}`}
    {...props}
  >
    {children}
  </div>
);

/**
 * PrimaryButton - A standardized gradient button with hover effects.
 */
export const PrimaryButton = ({ children, onClick, icon: Icon, className = '', disabled = false, ...props }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`
      flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all
      bg-[#6366f1] text-white hover:bg-[#4f46e5] active:scale-95
      disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#6366f1]/20
      ${className}
    `}
    {...props}
  >
    {Icon && <Icon size={20} />}
    {children}
  </button>
);

/**
 * IconButton - A square or circular utility button for icons.
 */
export const IconButton = ({ icon: Icon, onClick, className = '', ...props }) => (
  <button 
    onClick={onClick}
    className={`p-2 bg-[#222634] border border-[#2a2f3e] rounded-lg text-gray-400 hover:text-white hover:border-[#6366f1] transition-all ${className}`}
    {...props}
  >
    {Icon && <Icon size={18} />}
  </button>
);
