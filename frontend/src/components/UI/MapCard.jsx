import React, { useState, useRef, useEffect } from 'react';
import { Map as MapIcon, Star, MoreVertical, Pencil, Copy, Folder, Tag, Trash2 } from 'lucide-react';
import { templates } from '../Dashboard/TemplateGrid';
import * as mapApi from '../../services/api/mapApi';

const getGradientClass = (id) => {
  if (!id) return 'bg-grad-1';
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  const index = Math.abs(hash) % 6 + 1;
  return `bg-grad-${index}`;
};

const MapCard = ({ map, onClick, onTogglePin, viewMode = 'grid', isTrash = false, onRestore, onTrashMap, onDuplicateMap }) => {
  const isFavorite = map.isFavorite;
  const templateInfo = map.template ? templates.find(t => t.name === map.template) : null;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleAction = async (e, action) => {
    e.stopPropagation();
    setIsDropdownOpen(false);
    
    try {
      if (action === 'trash') {
        if (onTrashMap) onTrashMap(map.id);
      } else if (action === 'duplicate') {
        if (onDuplicateMap) onDuplicateMap(map.id);
      } else {
        alert(`${action} functionality coming soon!`);
      }
    } catch (err) {
      console.error(`Failed to ${action}:`, err);
    }
  };

  const DropdownMenu = () => (
    <div 
      ref={dropdownRef}
      className="absolute top-12 right-2 w-48 bg-bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="py-1">
        <button onClick={(e) => handleAction(e, 'Rename')} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-muted hover:bg-white/5 hover:text-text-h transition-colors">
          <Pencil size={14} /> Rename
        </button>
        <button onClick={(e) => handleAction(e, 'duplicate')} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-muted hover:bg-white/5 hover:text-text-h transition-colors">
          <Copy size={14} /> Duplicate
        </button>
        <button onClick={(e) => handleAction(e, 'Move to')} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-muted hover:bg-white/5 hover:text-text-h transition-colors">
          <Folder size={14} /> Move to...
        </button>
        <button onClick={(e) => handleAction(e, 'Edit Tags')} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-muted hover:bg-white/5 hover:text-text-h transition-colors">
          <Tag size={14} /> Edit Tags
        </button>
        <div className="h-px bg-white/5 my-1" />
        <button onClick={(e) => handleAction(e, 'trash')} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-400/10 transition-colors">
          <Trash2 size={14} /> Move to Trash
        </button>
      </div>
    </div>
  );

  if (viewMode === 'list') {
    return (
      <div 
        onClick={onClick}
        className={`group relative bg-bg-card border border-border hover:border-border-focus rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all hover:-translate-y-1 shadow-lg ${isDropdownOpen ? 'z-50' : 'z-0 hover:z-10'}`}
      >
        <div className="flex items-center gap-4 truncate flex-1">
          <div className={`w-8 h-8 rounded-lg ${templateInfo ? 'bg-bg-card border border-white/5' : getGradientClass(map.id)} shrink-0 overflow-hidden flex items-center justify-center`}>
            {templateInfo && templateInfo.svg ? (
                <div style={{ transform: 'scale(0.3)' }}>{templateInfo.svg}</div>
            ) : null}
          </div>
          <div className="p-1.5 bg-accent-bg text-accent rounded-md shrink-0">
            <MapIcon size={14} />
          </div>
          <h4 className="font-bold truncate group-hover:text-accent transition-colors">{map.name || 'Untitled'}</h4>
        </div>
        <div className="flex items-center gap-4 text-text-muted pr-2">
          <span className="text-xs hidden md:block">Edited recently</span>
          {!isTrash && (
            <button 
              onClick={(e) => { e.stopPropagation(); onTogglePin(e, map); }}
              className={`hover:text-[#ffd700] transition-colors ${isFavorite ? 'text-[#ffd700]' : ''}`}
            >
              <Star size={18} fill={isFavorite ? '#ffd700' : 'none'} />
            </button>
          )}
          {!isTrash && (
            <div className="relative flex items-center h-full">
              <button onClick={toggleDropdown} className="p-1 hover:text-text-h hover:bg-white/10 rounded-md transition-colors">
                <MoreVertical size={18} />
              </button>
              {isDropdownOpen && <DropdownMenu />}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className={`group relative bg-bg-card border border-border hover:border-border-focus rounded-2xl cursor-pointer transition-all hover:-translate-y-1 shadow-lg hover:shadow-2xl ${isDropdownOpen ? 'z-50' : 'z-0 hover:z-10'}`}
    >
      <div className="h-28 w-full relative">
        <div className={`absolute inset-0 rounded-t-2xl overflow-hidden ${templateInfo ? 'bg-bg-card-hover flex items-center justify-center' : getGradientClass(map.id)}`}>
          {templateInfo && templateInfo.svg ? (
              <div className="w-full h-full flex items-center justify-center opacity-80" style={{ transform: 'scale(1.2)' }}>
                  {templateInfo.svg}
              </div>
          ) : null}
        </div>
        
        {!isTrash && (
          <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
            <button 
              onClick={(e) => { e.stopPropagation(); onTogglePin(e, map); }}
              className="p-2 bg-black/20 backdrop-blur-md rounded-lg text-text-h hover:bg-black/40 transition-colors"
            >
              <Star size={16} fill={isFavorite ? '#ffd700' : 'none'} className={isFavorite ? 'text-[#ffd700]' : 'text-text-h'} />
            </button>
            <button 
              onClick={toggleDropdown}
              className="p-2 bg-black/20 backdrop-blur-md rounded-lg text-text-h hover:bg-black/40 transition-colors"
            >
              <MoreVertical size={16} />
            </button>
            {isDropdownOpen && <DropdownMenu />}
          </div>
        )}
      </div>
      <div className="p-5 flex items-center gap-4 relative z-0">
        <div className="p-2.5 bg-accent-bg text-accent rounded-lg">
          <MapIcon size={20} />
        </div>
        <div className="truncate">
          <h4 className="font-bold truncate group-hover:text-accent transition-colors">{map.name || 'Untitled'}</h4>
          <p className="text-xs text-text-muted">Edited recently</p>
        </div>
      </div>
    </div>
  );
};

export default MapCard;
