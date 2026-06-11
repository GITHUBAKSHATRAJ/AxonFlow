import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * [CHILD COMPONENT / DIALOG COMPONENT]
 * CreateItemModal is a Named Function component that acts as a custom dialog.
 * 
 * Concept: This component mixes local state (controlling the text input value)
 * with props passed down from the parent (which control open status and submission commands).
 */
function CreateItemModal({ isOpen, onClose, onSubmit, title, placeholder }) {
  // [LOCAL STATE]
  // Holds the text input typed by the user. This is local state because the parent component
  // doesn't need to know what the user is typing keystroke-by-keystroke; it only needs
  // the final value when the form is submitted.
  const [inputValue, setInputValue] = useState('');

  // [REACT HOOK: useEffect]
  // Resets the input text to empty whenever the modal is opened.
  useEffect(function () {
    if (isOpen) {
      setInputValue('');
    }
  }, [isOpen]);

  // [CONDITIONAL RENDERING]
  // If the 'isOpen' prop is false, we return 'null' so React renders absolutely nothing in the DOM.
  if (!isOpen) return null;

  // [ARROW FUNCTION FOR SMALL UTILITY OPERATION]
  // Handles form submission, calling the parent submit handler callback.
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSubmit(inputValue.trim());
      onClose(); // Close modal after successful submission
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop (Dark dimmed background overlay) */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Box Container */}
      <div className="relative w-full max-w-md bg-gradient-to-br from-[#1a1d27] to-[#141721] border border-border rounded-3xl p-8 shadow-2xl shadow-black/80 animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl hover:bg-bg-card-hover text-text-muted hover:text-text-h transition-all"
        >
          <X size={18} />
        </button>

        <h3 className="text-xl font-bold mb-2 text-text-h">{title}</h3>
        <p className="text-text-muted text-sm mb-6">Please enter a name for the new item below.</p>

        {/* 
          [CONTROLLED INPUT FORM]
          The input's 'value' is tied directly to the React state variable 'inputValue', 
          and the 'onChange' event updates that state. This is called a "Controlled Component".
        */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input 
              type="text"
              autoFocus
              placeholder={placeholder || "Enter name..."}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-bg border border-border focus:border-accent rounded-xl py-3 px-4 text-sm outline-none transition-all text-text-h"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-border text-text-muted hover:text-text-h hover:bg-bg-card-hover text-xs font-bold transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={!inputValue.trim()}
              className="bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:hover:bg-accent text-text-h px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateItemModal;
