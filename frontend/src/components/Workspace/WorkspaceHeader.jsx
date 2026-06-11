import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, LayoutGrid, List, Plus } from 'lucide-react';

/**
 * [CHILD COMPONENT / PRESENTATIONAL COMPONENT]
 * WorkspaceHeader is a Named Function component.
 * 
 * Concept: This is a "Presentational Component". It doesn't contain heavy business logic or API calls.
 * Instead, it receives dynamic values and callbacks from its parent (WorkspaceView) via "Props",
 * styles them using Tailwind classes, and triggers the parent callbacks when buttons are clicked.
 */
function WorkspaceHeader({
  decodedWorkspace,
  currentFolderId,
  breadcrumbs,
  viewMode,
  setViewMode,
  onCreateClick,
  navigateToBreadcrumb
}) {
  // [REACT ROUTER HOOK]
  const navigate = useNavigate();

  return (
    <header className="h-[72px] shrink-0 border-b border-border bg-bg-card/50 backdrop-blur-xl flex items-center justify-between px-12">
      <div className="flex items-center gap-4 text-sm">
        
        {/* Navigation Button */}
        <button 
          onClick={() => decodedWorkspace ? (currentFolderId ? navigateToBreadcrumb(-1) : navigate('/workspaces')) : navigate('/')}
          className="p-2 hover:bg-bg-card-hover rounded-lg text-text-muted hover:text-text-h transition-all"
        >
          <ArrowLeft size={18} />
        </button>
        
        <div className="h-6 w-px bg-gray-800" />
        
        {/* 
          [BREADCRUMB RENDERING]
          Dynamically maps the workspace and sub-folders path array.
          Each array element creates a clickable link back to its corresponding directory.
        */}
        <div className="flex items-center gap-2">
          <span 
            onClick={() => navigate('/workspaces')}
            className={`cursor-pointer hover:text-accent transition-colors ${!decodedWorkspace ? 'text-text-h font-bold' : 'text-text-muted'}`}
          >
            Workspaces
          </span>
          {decodedWorkspace && (
            <>
              <ChevronRight size={14} className="text-gray-700" />
              <span 
                onClick={() => navigateToBreadcrumb(-1)}
                className={`cursor-pointer hover:text-accent transition-colors ${!currentFolderId ? 'text-text-h font-bold' : 'text-text-muted'}`}
              >
                {decodedWorkspace}
              </span>
            </>
          )}
          {/*
            [DOM RECONCILIATION - key={bc.id}]
            Using the unique Folder ID as the key allows React's rendering algorithm to track 
            individual breadcrumbs during list rendering.
          */}
          {breadcrumbs.map((bc, idx) => (
            <React.Fragment key={bc.id}>
              <ChevronRight size={14} className="text-gray-700" />
              <span 
                onClick={() => navigateToBreadcrumb(idx)}
                className={`cursor-pointer hover:text-accent transition-colors ${idx === breadcrumbs.length - 1 ? 'text-text-h font-bold' : 'text-text-muted'}`}
              >
                {bc.name}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Grid and List View Toggle Switches */}
        <div className="flex bg-bg-card border border-border rounded-lg p-1">
          <button 
            onClick={() => setViewMode('grid')} 
            className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-bg-card-hover text-accent' : 'text-text-muted'}`}
          >
            <LayoutGrid size={16} />
          </button>
          <button 
            onClick={() => setViewMode('list')} 
            className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-bg-card-hover text-accent' : 'text-text-muted'}`}
          >
            <List size={16} />
          </button>
        </div>

        {/* Creation CTA Button */}
        <button 
          onClick={onCreateClick}
          className="bg-accent hover:bg-accent-hover text-text-h px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-accent/20 active:translate-y-px"
        >
          <Plus size={16} /> New {decodedWorkspace ? 'Map' : 'Workspace'}
        </button>
      </div>
    </header>
  );
}

export default WorkspaceHeader;
