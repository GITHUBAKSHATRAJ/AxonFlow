import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  BrainCircuit, LayoutDashboard, FolderOpen, LayoutTemplate, Settings,
  LogOut, User as UserIcon, Plus, Star, Folder, Users, Trash2,
  ChevronDown, ChevronRight, MoreVertical, Edit2, Sun, Moon
} from 'lucide-react';
import { useAuth } from '../context/authContext';
import * as folderApi from '../services/api/folderApi';
import * as mapApi from '../services/api/mapApi';

const WorkspaceFolderItem = ({ folder, level = 0, workspaceName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [children, setChildren] = useState([]);
  const navigate = useNavigate();

  const handleToggle = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isOpen) {
      folderApi.fetchFolders(workspaceName, folder.id)
        .then(data => setChildren(data || []))
        .catch(console.error);
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col">
      <div
        onClick={() => navigate(`/workspaces/${encodeURIComponent(workspaceName)}`)}
        className="flex items-center justify-between py-1 pr-3 hover:text-white transition-colors cursor-pointer text-[13px]"
        style={{ marginLeft: `${level * 16}px` }}
      >
        <div className="flex items-center gap-1.5 overflow-hidden">
          <button onClick={handleToggle} className="p-0.5 text-gray-500 hover:text-gray-300">
            {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </button>
          <Folder size={12} className="text-[#6366f1] shrink-0" />
          <span className="truncate">{folder.name}</span>
        </div>
      </div>

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
};

const WorkspaceSubFolders = ({ workspaceName }) => {
  const [folders, setFolders] = useState([]);

  useEffect(() => {
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
};

const GlobalSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [workspaces, setWorkspaces] = useState([]);
  const [foldersOpen, setFoldersOpen] = useState(true);
  const [openWorkspaces, setOpenWorkspaces] = useState({});

  useEffect(() => {
    folderApi.fetchWorkspaces().then(data => {
      if (data) setWorkspaces(data);
    }).catch(console.error);
  }, []);

  const handleQuickCreate = async () => {
    try {
      const res = await mapApi.createMap('New Idea Map');
      navigate(`/map/${res.id}`);
    } catch (err) {
      console.error('Quick create failed:', err);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'My Maps', path: '/maps', icon: FolderOpen },
    { name: 'Favorites', path: '/favorites', icon: Star },
    { name: 'Workspaces', path: '/workspaces', icon: Folder, isAccordion: true },
    { name: 'Trash', path: '/trash', icon: Trash2 },
  ];

  return (
    <aside className="w-64 h-screen bg-[#1a1d27] border-r border-[#2a2f3e] flex flex-col shrink-0 text-[#f9fafb]">
      {/* Brand */}
      <div className="h-[72px] flex items-center px-6 gap-3 border-b border-[#2a2f3e] shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#a855f7] flex items-center justify-center text-white shadow-lg shadow-[#6366f1]/40">
          <BrainCircuit size={18} />
        </div>
        <span className="text-lg font-bold tracking-tight">AxonFlow</span>
      </div>

      {/* Quick Action */}
      <div className="p-5 pb-2 shrink-0">
        <button
          onClick={handleQuickCreate}
          className="w-full bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-xl py-2.5 flex items-center justify-center gap-2 font-semibold text-sm transition-all shadow-lg shadow-[#6366f1]/20 active:translate-y-px"
        >
          <Plus size={18} /> New Map
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto flex flex-col gap-6">
        <div>
          <div className="text-[11px] text-gray-500 font-bold px-2 mb-2 uppercase tracking-widest">Workspace</div>
          <div className="flex flex-col gap-1">
            {navItems.map(item => (
              <div key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl transition-all group
                    ${isActive ? 'bg-[#6366f1]/10 text-[#6366f1] font-semibold' : 'text-gray-400 hover:bg-[#222634] hover:text-white'}
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
                
                {item.isAccordion && foldersOpen && (
                  <div className="pl-4 mt-2 flex flex-col gap-1 border-l border-gray-800 ml-6">
                    {workspaces.map(w => (
                      <div key={w} className="flex flex-col">
                        <div className="flex items-center gap-2 py-1.5 px-3 hover:text-white text-gray-400 text-sm cursor-pointer group">
                          <span 
                            onClick={() => setOpenWorkspaces(prev => ({ ...prev, [w]: !prev[w] }))}
                            className="text-gray-600 group-hover:text-gray-400"
                          >
                             {openWorkspaces[w] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                          </span>
                          <NavLink to={`/workspaces/${encodeURIComponent(w)}`} className="flex items-center gap-2 truncate">
                            <Folder size={14} className="text-[#6366f1]" />
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

      {/* User Footer */}
      <div className="p-4 border-t border-[#2a2f3e] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 truncate">
          {user?.avatar ? (
            <img src={user.avatar} className="w-8 h-8 rounded-full border border-white/10" alt="p" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#222634] flex items-center justify-center text-gray-500">
              <UserIcon size={16} />
            </div>
          )}
          <div className="truncate">
            <div className="text-[13px] font-semibold truncate text-white">{user?.name || 'Akshat Raj'}</div>
            <div className="text-[11px] text-gray-500 truncate">Pro Account</div>
          </div>
        </div>
        <button onClick={() => logout()} className="p-2 text-gray-500 hover:text-red-400 transition-colors">
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};

export default GlobalSidebar;
