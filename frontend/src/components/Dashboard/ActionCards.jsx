import React from 'react';
import { Plus, Sparkles } from 'lucide-react';

/**
 * [CHILD COMPONENT / PRESENTATIONAL COMPONENT]
 * ActionCards is a Named Function component that displays CTA cards.
 * 
 * Concept: Passes click handlers up as props to coordinate modal state changes 
 * and map initialization inside the dashboard container page.
 */
function ActionCards({ handleCreateNew, setIsAiModalOpen }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
      {/* Create New Blank Map CTA */}
      <button 
        onClick={handleCreateNew}
        className="group relative overflow-hidden bg-gradient-to-br from-[#1a1d27] to-[#141721] border border-border hover:border-border-focus rounded-3xl p-8 flex items-center gap-6 transition-all hover:-translate-y-1"
      >
        <div className="w-16 h-16 bg-accent text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#6366f1]/30">
          <Plus size={32} />
        </div>
        <div className="text-left">
          <h3 className="text-xl font-bold mb-1">New Blank Map</h3>
          <p className="text-text-muted text-sm">Start from scratch with a clean canvas.</p>
        </div>
      </button>

      {/* AI Map Generator trigger CTA */}
      <button 
        onClick={() => setIsAiModalOpen(true)}
        className="group relative overflow-hidden bg-gradient-to-br from-[#1a1d27] to-[#141721] border border-[#8b5cf6]/30 hover:border-[#8b5cf6] rounded-3xl p-8 flex items-center gap-6 transition-all hover:-translate-y-1"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-[#8b5cf6] to-[#d946ef] text-text-h rounded-2xl flex items-center justify-center shadow-lg shadow-[#8b5cf6]/30">
          <Sparkles size={32} />
        </div>
        <div className="text-left">
          <h3 className="text-xl font-bold mb-1">Generate with AI</h3>
          <p className="text-text-muted text-sm">Describe a topic and watch AxonFlow build it.</p>
        </div>
      </button>
    </div>
  );
}

export default ActionCards;
