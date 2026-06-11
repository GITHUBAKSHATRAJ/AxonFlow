import React from 'react';
import { X, Sparkles, Upload } from 'lucide-react';
import { PrimaryButton } from '../UI/UIComponents';

/**
 * [CHILD COMPONENT / DIALOG COMPONENT]
 * AiGeneratorModal is a Named Function component that allows prompts input.
 * 
 * Concept: Controlled form inputs where values (aiPrompt, selectedModel) 
 * are bound to parent-provided props. Updates propagate to the parent's state hooks on change.
 */
function AiGeneratorModal({
  setIsAiModalOpen,
  aiPrompt,
  setAiPrompt,
  availableModels,
  selectedModel,
  setSelectedModel,
  handleCreateAI
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-bg-card border border-border rounded-[32px] w-full max-w-2xl p-8 shadow-2xl relative">
        <button onClick={() => setIsAiModalOpen(false)} className="absolute top-6 right-6 text-text-muted hover:text-text-h transition-colors">
          <X size={24} />
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="text-[#8b5cf6]" size={24} />
            <h2 className="text-2xl font-bold">AI Mind Map Generator</h2>
          </div>
          <p className="text-text-muted">Describe what you want to visualize, and AxonFlow will do the rest.</p>
        </div>

        <div className="mb-6">
          <div className="p-1 bg-gradient-to-r from-[#d946ef] via-[#8b5cf6] to-[#6366f1] rounded-2xl">
            <textarea 
              autoFocus
              placeholder="e.g. History of Space Exploration or Marketing Strategy for a SaaS"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="w-full h-40 bg-bg-card rounded-[15px] p-6 text-text-h outline-none resize-none text-lg placeholder:text-gray-600"
            />
          </div>
          <div className="flex justify-between items-center mt-3 px-2">
            <button className="flex items-center gap-2 text-sm text-text-muted hover:text-text-h transition-colors">
              <Upload size={14} /> Add Reference File
            </button>
            <span className="text-xs text-gray-600">{aiPrompt.length} / 5000</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 mb-8">
          <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest px-1">AI Model Selection</label>
          <select 
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full bg-bg-card-hover border border-border rounded-xl p-3 text-text-h outline-none cursor-pointer hover:border-gray-600 transition-colors"
          >
            {availableModels.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div className="flex justify-end gap-4">
          <button 
            onClick={() => setIsAiModalOpen(false)}
            className="px-6 py-3 rounded-xl border border-border font-semibold hover:bg-bg-card-hover transition-colors"
          >
            Cancel
          </button>
          <PrimaryButton 
            onClick={handleCreateAI}
            disabled={!aiPrompt.trim()}
            icon={Sparkles}
          >
            Generate Map
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

export default AiGeneratorModal;
