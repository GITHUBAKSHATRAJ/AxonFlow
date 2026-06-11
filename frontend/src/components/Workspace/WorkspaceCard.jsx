import React from 'react';
import { Folder } from 'lucide-react';

/**
 * [CHILD COMPONENT / PRESENTATIONAL COMPONENT]
 * WorkspaceCard is a Named Function component representing top-level workspaces.
 * 
 * Concept: This is a presentational card that renders a specific workspace name.
 * It is completely stateless, relying on the parent container (WorkspaceView) to handle click routing actions.
 */
function WorkspaceCard({ name, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="group flex flex-col items-center gap-3 cursor-pointer"
    >
      <div className="w-full aspect-square bg-gradient-to-br from-[#1d4ed8] to-[#3b82f6] rounded-[24px] rounded-tl-[12px] flex items-center justify-center shadow-xl group-hover:-translate-y-2 group-hover:shadow-[#1d4ed8]/40 transition-all border-l-[10px] border-black/20">
        <Folder size={48} className="text-text-h group-hover:scale-110 transition-transform" />
      </div>
      <span className="font-bold text-text-muted group-hover:text-text-h transition-colors">
        {name}
      </span>
    </div>
  );
}

export default WorkspaceCard;
