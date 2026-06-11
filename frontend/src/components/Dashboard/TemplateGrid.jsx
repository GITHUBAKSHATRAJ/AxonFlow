import React from 'react';

// Static templates configuration data array used by both TemplateGrid and MapCard components
export const templates = [
  { 
    name: 'Brainstorming', 
    desc: 'Free-form exploration', 
    svg: (
      <svg width="100%" height="80" className="mb-3 bg-white/5 rounded-xl" viewBox="0 0 160 80">
        <line x1="80" y1="40" x2="35" y2="25" stroke="#6366f1" strokeWidth="2" strokeDasharray="3,3" opacity="0.6" />
        <line x1="80" y1="40" x2="125" y2="25" stroke="#6366f1" strokeWidth="2" strokeDasharray="3,3" opacity="0.6" />
        <line x1="80" y1="40" x2="50" y2="60" stroke="#6366f1" strokeWidth="2" strokeDasharray="3,3" opacity="0.6" />
        <line x1="80" y1="40" x2="110" y2="60" stroke="#6366f1" strokeWidth="2" strokeDasharray="3,3" opacity="0.6" />
        <circle cx="80" cy="40" r="11" fill="#6366f1" opacity="0.9" />
        <circle cx="35" cy="25" r="7" fill="#fff" opacity="0.4" />
        <circle cx="125" cy="25" r="7" fill="#fff" opacity="0.4" />
        <circle cx="50" cy="60" r="7" fill="#fff" opacity="0.4" />
        <circle cx="110" cy="60" r="7" fill="#fff" opacity="0.4" />
      </svg>
    )
  },
  { 
    name: 'Flowchart', 
    desc: 'Process & logic mapping', 
    svg: (
      <svg width="100%" height="80" className="mb-3 bg-white/5 rounded-xl" viewBox="0 0 160 80">
        <line x1="80" y1="22" x2="80" y2="34" stroke="#6366f1" strokeWidth="2" opacity="0.6" />
        <line x1="80" y1="46" x2="80" y2="58" stroke="#6366f1" strokeWidth="2" opacity="0.6" />
        <rect x="55" y="10" width="50" height="13" rx="4" fill="#fff" opacity="0.3" />
        <polygon points="80,33 96,42 80,51 64,42" fill="#6366f1" opacity="0.8" />
        <rect x="55" y="58" width="50" height="13" rx="4" fill="#fff" opacity="0.3" />
      </svg>
    )
  },
  { 
    name: 'Project Planning', 
    desc: 'Milestones & timelines', 
    svg: (
      <svg width="100%" height="80" className="mb-3 bg-white/5 rounded-xl" viewBox="0 0 160 80">
        <line x1="30" y1="15" x2="30" y2="65" stroke="#6366f1" strokeWidth="1.5" opacity="0.5" />
        <line x1="30" y1="22" x2="130" y2="22" stroke="#fff" strokeWidth="1" strokeDasharray="2,2" opacity="0.2" />
        <line x1="30" y1="42" x2="130" y2="42" stroke="#fff" strokeWidth="1" strokeDasharray="2,2" opacity="0.2" />
        <line x1="30" y1="62" x2="130" y2="62" stroke="#fff" strokeWidth="1" strokeDasharray="2,2" opacity="0.2" />
        <rect x="40" y="15" width="45" height="12" rx="3" fill="#6366f1" opacity="0.8" />
        <rect x="65" y="35" width="55" height="12" rx="3" fill="#fff" opacity="0.3" />
        <rect x="90" y="55" width="35" height="12" rx="3" fill="#fff" opacity="0.2" />
      </svg>
    )
  }
];

/**
 * [CHILD COMPONENT / PRESENTATIONAL COMPONENT]
 * TemplateGrid displays a grid of visual template CTA layouts.
 * 
 * Concept: Iterates through template options. If a template is click-supported, 
 * it triggers the creation callback. Otherwise, it updates context settings to show a coming-soon modal.
 */
function TemplateGrid({ handleCreateFromTemplate, setComingSoonTemplate }) {
  return (
    <div className="mb-12">
      <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-6">Recommended Templates</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <button 
            key={template.name}
            onClick={() => {
              if (template.name === 'Brainstorming') {
                handleCreateFromTemplate(template.name);
              } else {
                setComingSoonTemplate(template.name);
              }
            }}
            className="bg-bg-card border border-border hover:border-border-focus rounded-2xl p-6 text-left transition-all hover:-translate-y-1 group"
          >
            {template.svg}
            <div className="font-bold text-text-h mb-1">{template.name}</div>
            <div className="text-xs text-text-muted">{template.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default TemplateGrid;
