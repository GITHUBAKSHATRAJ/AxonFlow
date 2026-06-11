import React from 'react';
import { Sparkles } from 'lucide-react';

/**
 * [CHILD COMPONENT / DIALOG COMPONENT]
 * ComingSoonModal displays notification feedback overlays.
 * 
 * Concept: Standard conditional return rendering where we return 'null' (rendering nothing)
 * if 'comingSoonTemplate' is empty.
 */
function ComingSoonModal({ comingSoonTemplate, setComingSoonTemplate }) {
  if (!comingSoonTemplate) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
      <div className="bg-bg-card border border-border rounded-3xl w-full max-w-sm p-8 text-center animate-in zoom-in duration-200">
        <div className="w-16 h-16 bg-accent-bg text-accent rounded-full flex items-center justify-center mx-auto mb-6">
          <Sparkles size={32} />
        </div>
        <h3 className="text-xl font-bold mb-2">{comingSoonTemplate} Template</h3>
        <p className="text-text-muted mb-8">This template is currently under development and will be available soon!</p>
        <button 
          onClick={() => setComingSoonTemplate(null)}
          className="w-full bg-accent text-white rounded-xl py-3 font-bold hover:bg-accent-hover transition-colors"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}

export default ComingSoonModal;
