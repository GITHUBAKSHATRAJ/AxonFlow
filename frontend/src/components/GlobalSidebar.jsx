import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  BrainCircuit, LayoutDashboard, FolderOpen,
  LogOut, User as UserIcon, Plus, Star, Folder, Users, Trash2,
  ChevronDown, ChevronRight, Moon, Sun
} from 'lucide-react';
import { useAuth } from '../context/authContext';
import * as folderApi from '../services/api/folderApi';
import * as mapApi from '../services/api/mapApi';

/**
 * [RECURSIVE NAMED COMPONENT]
 * WorkspaceFolderItem represents folder directories.
 * 
 * Concept: This component is "Recursive" because it can render copies of itself
 * to draw nested folders inside folders at increasing levels of indentation.
 */
function WorkspaceFolderItem({ folder, level = 0, workspaceName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [children, setChildren] = useState([]);
  const navigate = useNavigate();

  // [NAMED FUNCTION] - Toggle directory expansion
  function handleToggle(e) {
    // Intercept event propagation to prevent clicking the folder toggle 
    // from triggering navigation to the workspace main page.
    e.stopPropagation();
    e.preventDefault();
    if (!isOpen) {
      folderApi.fetchFolders(workspaceName, folder.id)
        .then(data => setChildren(data || []))
        .catch(console.error);
    }
    setIsOpen(!isOpen);
  }

  return (
    <div className="flex flex-col">
      <div
        onClick={() => navigate(`/workspaces/${encodeURIComponent(workspaceName)}`)}
        className="flex items-center justify-between py-1 pr-3 hover:text-text-h transition-colors cursor-pointer text-[13px]"
        style={{ marginLeft: `${level * 16}px` }}
      >
        <div className="flex items-center gap-1.5 overflow-hidden">
          <button onClick={handleToggle} className="p-0.5 text-text-muted hover:text-text-muted">
            {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </button>
          <Folder size={12} className="text-accent shrink-0" />
          <span className="truncate">{folder.name}</span>
        </div>
      </div>

      {/* 
        [RECURSIVE LIST RENDERING]
        If the folder is expanded (isOpen is true) and holds items, it recursively maps 
        each subfolder child as another '<WorkspaceFolderItem />'.
      */}
      {isOpen && children.length > 0 && (
        <div className="flex flex-col gap-0.5">
          {children.map(child => (
            <WorkspaceFolderItem
              key={child.id}
              folder={child}
              level={level + 1}
              workspaceName={workspaceName}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * [NAMED COMPONENT] - Helper rendering subfolders list
 */
function WorkspaceSubFolders({ workspaceName }) {
  const [folders, setFolders] = useState([]);

  // Fetch folders on mount or whenever the workspaceName changes
  useEffect(function () {
    folderApi.fetchFolders(workspaceName, null)
      .then(data => {
        if (data) setFolders(data.filter(f => f.name !== '.workspace'));
      })
      .catch(console.error);
  }, [workspaceName]);

  if (folders.length === 0) return null;

  return (
    <div className="flex flex-col gap-0.5 pl-6 mt-0.5">
      {folders.map(folder => (
        <WorkspaceFolderItem
          key={folder.id}
          folder={folder}
          workspaceName={workspaceName}
        />
      ))}
    </div>
  );
}

/**
 * [CONTAINER / NAMED COMPONENT]
 * GlobalSidebar renders the persistent left navigation bar overlay.
 */
function GlobalSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [workspaces, setWorkspaces] = useState([]);
  const [foldersOpen, setFoldersOpen] = useState(true);
  const [openWorkspaces, setOpenWorkspaces] = useState({});
  const [activeTheme, setActiveTheme] = useState(() => localStorage.getItem('app-theme') || 'dark');

  // [THEME SIDE-EFFECT]
  // Applies the theme settings directly to the document root element.
  useEffect(function () {
    document.documentElement.setAttribute('data-theme', activeTheme);
    localStorage.setItem('app-theme', activeTheme);
  }, [activeTheme]);

  // [NAMED FUNCTION] - Cycle active UI styling color palettes
  function toggleTheme() {
    const next = activeTheme === 'dark' ? 'light' : activeTheme === 'light' ? 'neon' : 'dark';
    setActiveTheme(next);
  }

  // Fetch all user workspaces on page mount
  useEffect(function () {
    folderApi.fetchWorkspaces().then(data => {
      if (data) setWorkspaces(data);
    }).catch(console.error);
  }, []);

  // [NAMED FUNCTION] - Quickly create a blank standalone map
  async function handleQuickCreate() {
    try {
      const res = await mapApi.createMap('New Idea Map');
      navigate(`/map/${res.id}`);
    } catch (err) {
      console.error('Quick create failed:', err);
    }
  }

  // Navigation route metadata list
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'My Maps', path: '/maps', icon: FolderOpen },
    { name: 'Favorites', path: '/favorites', icon: Star },
    { name: 'Workspaces', path: '/workspaces', icon: Folder, isAccordion: true },
    { name: 'Shared with Me', path: '/shared', icon: Users },
    { name: 'Trash', path: '/trash', icon: Trash2 },
  ];

  return (
    <aside className="w-64 h-screen bg-bg-card border-r border-border flex flex-col shrink-0 text-text-h">
      {/* Brand */}
      <div className="h-[72px] flex items-center px-6 gap-3 border-b border-border shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#a855f7] flex items-center justify-center text-text-h shadow-lg shadow-accent/40">
          <BrainCircuit size={18} />
        </div>
        <span className="text-lg font-bold tracking-tight">AxonFlow</span>
      </div>

      {/* Quick Action Button */}
      <div className="p-5 pb-2 shrink-0">
        <button
          onClick={handleQuickCreate}
          className="w-full bg-accent hover:bg-accent-hover text-text-h rounded-xl py-2.5 flex items-center justify-center gap-2 font-semibold text-sm transition-all shadow-lg shadow-accent/20 active:translate-y-px"
        >
          <Plus size={18} /> New Map
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-4 overflow-y-auto flex flex-col gap-6">
        <div>
          <div className="text-[11px] text-text-muted font-bold px-2 mb-2 uppercase tracking-widest">Workspace</div>
          <div className="flex flex-col gap-1">
            {navItems.map(item => (
              <div key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl transition-all group
                    ${isActive ? 'bg-accent-bg text-accent font-semibold' : 'text-text-muted hover:bg-bg-card-hover hover:text-text-h'}
                  `}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <item.icon size={18} className="group-hover:scale-110 transition-transform" />
                    <span>{item.name}</span>
                  </div>
                  {item.isAccordion && (
                    <div 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFoldersOpen(!foldersOpen); }}
                        className="p-1 hover:bg-white/5 rounded-md"
                    >
                        {foldersOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </div>
                  )}
                </NavLink>
                
                {/* Render Accordion for Workspace folders */}
                {item.isAccordion && foldersOpen && (
                  <div className="pl-4 mt-2 flex flex-col gap-1 border-l border-gray-800 ml-6">
                    {workspaces.map(w => (
                      <div key={w} className="flex flex-col">
                        <div className="flex items-center gap-2 py-1.5 px-3 hover:text-text-h text-text-muted text-sm cursor-pointer group">
                          <span 
                            onClick={() => setOpenWorkspaces(prev => ({ ...prev, [w]: !prev[w] }))}
                            className="text-gray-600 group-hover:text-text-muted"
                          >
                             {openWorkspaces[w] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                          </span>
                          <NavLink to={`/workspaces/${encodeURIComponent(w)}`} className="flex items-center gap-2 truncate">
                            <Folder size={14} className="text-accent" />
                            <span className="truncate">{w}</span>
                          </NavLink>
                        </div>
                        {openWorkspaces[w] && <WorkspaceSubFolders workspaceName={w} />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* User Footer Panel */}
      <div className="p-4 border-t border-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 truncate">
          {user?.avatar ? (
            <img src={user.avatar} className="w-8 h-8 rounded-full border border-white/10" alt="p" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-bg-card-hover flex items-center justify-center text-text-muted">
              <UserIcon size={16} />
            </div>
          )}
          <div className="truncate">
            <div className="text-[13px] font-semibold truncate text-text-h">{user?.name || 'Akshat Raj'}</div>
            <div className="text-[11px] text-text-muted truncate">Pro Account</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={toggleTheme}
            className="p-2 text-text-muted hover:text-text-h transition-colors"
            title={`Switch to theme`}
          >
            {activeTheme === 'dark' ? <Moon size={16} /> : activeTheme === 'light' ? <Sun size={16} /> : <Sun size={16} className="text-[#00ff9f]" />}
          </button>
          <button onClick={() => logout()} className="p-2 text-text-muted hover:text-red-400 transition-colors">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default GlobalSidebar;
