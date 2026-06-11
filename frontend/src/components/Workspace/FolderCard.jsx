import React from 'react';
import { Folder } from 'lucide-react';

/**
 * [CHILD COMPONENT / PRESENTATIONAL COMPONENT]
 * FolderCard is a Named Function component representing folder items.
 * 
 * Concept: This is a lightweight, stateless presentation card. It gets folder details 
 * and trigger callbacks via props, rendering the visual element using Tailwind classes.
 */
function FolderCard({ folder, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="group flex flex-col items-center gap-3 cursor-pointer"
    >
      <div className="w-full aspect-square bg-bg-card border border-border group-hover:border-border-focus rounded-2xl flex items-center justify-center transition-all group-hover:-translate-y-1">
        <Folder size={40} className="text-accent group-hover:scale-110 transition-transform" />
      </div>
      <span className="font-semibold text-sm text-text-muted group-hover:text-text-h truncate w-full text-center">
        {folder.name}
      </span>
    </div>
  );
}

export default FolderCard;
