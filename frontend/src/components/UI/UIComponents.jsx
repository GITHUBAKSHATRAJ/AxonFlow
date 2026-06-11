import React from 'react';

/**
 * [NAMED COMPONENT]
 * GlassCard - A reusable semi-transparent card with backdrop blur.
 * 
 * Concept: Uses destructured '{ children }' to dynamically inject nested elements
 * inside this visual wrapper. The '...props' collects all other HTML properties (like style, title)
 * and applies them using the spread operator '{...props}'.
 */
export function GlassCard({ children, className = '', ...props }) {
  return (
    <div 
      className={`bg-bg-card/80 backdrop-blur-md border border-border rounded-2xl p-6 shadow-xl ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * [NAMED COMPONENT]
 * PrimaryButton - A standardized gradient button with hover effects.
 * 
 * Concept: A reusable layout button that accepts callbacks (onClick), conditional flags (disabled),
 * and dynamic icons (Icon) passed down as properties.
 */
export function PrimaryButton({ children, onClick, icon: Icon, className = '', disabled = false, ...props }) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all
        bg-accent text-white hover:bg-accent-hover active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent/20
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon size={20} />}
      {children}
    </button>
  );
}

/**
 * [NAMED COMPONENT]
 * IconButton - A square or circular utility button for icons.
 */
export function IconButton({ icon: Icon, onClick, className = '', ...props }) {
  return (
    <button 
      onClick={onClick}
      className={`p-2 bg-bg-card-hover border border-border rounded-lg text-text-muted hover:text-text-h hover:border-border-focus transition-all ${className}`}
      {...props}
    >
      {Icon && <Icon size={18} />}
    </button>
  );
}
