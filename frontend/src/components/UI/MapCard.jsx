import React from 'react';
import { Map as MapIcon, Star } from 'lucide-react';

const getGradientClass = (id) => {
  if (!id) return 'bg-grad-1';
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  const index = Math.abs(hash) % 6 + 1;
  return `bg-grad-${index}`;
};

const MapCard = ({ map, onClick, onTogglePin, viewMode = 'grid', isTrash = false, onRestore }) => {
  const isFavorite = map.isFavorite;

  if (viewMode === 'list') {
    return (
      <div 
        onClick={onClick}
        className="group bg-[#1a1d27] border border-[#2a2f3e] hover:border-[#6366f1] rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all hover:-translate-y-1 shadow-lg"
      >
        <div className="flex items-center gap-4 truncate flex-1">
          <div className={`w-8 h-8 rounded-lg ${getGradientClass(map.id)} shrink-0`} />
          <div className="p-1.5 bg-[#6366f1]/10 text-[#6366f1] rounded-md shrink-0">
            <MapIcon size={14} />
          </div>
          <h4 className="font-bold truncate group-hover:text-[#6366f1] transition-colors">{map.name || 'Untitled'}</h4>
        </div>
        <div className="flex items-center gap-6 text-gray-500">
          <span className="text-xs hidden md:block">Edited recently</span>
          {!isTrash && (
            <button 
              onClick={(e) => { e.stopPropagation(); onTogglePin(e, map); }}
              className={`hover:text-[#ffd700] transition-colors ${isFavorite ? 'text-[#ffd700]' : ''}`}
            >
              <Star size={18} fill={isFavorite ? '#ffd700' : 'none'} />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className="group bg-[#1a1d27] border border-[#2a2f3e] hover:border-[#6366f1] rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1 shadow-lg hover:shadow-2xl"
    >
      <div className={`h-28 w-full relative ${getGradientClass(map.id)}`}>
        {!isTrash && (
          <button 
            onClick={(e) => { e.stopPropagation(); onTogglePin(e, map); }}
            className="absolute top-3 right-3 p-2 bg-black/20 backdrop-blur-md rounded-lg text-white hover:bg-black/40 transition-colors"
          >
            <Star size={16} fill={isFavorite ? '#ffd700' : 'none'} className={isFavorite ? 'text-[#ffd700]' : 'text-white'} />
          </button>
        )}
      </div>
      <div className="p-5 flex items-center gap-4">
        <div className="p-2.5 bg-[#6366f1]/10 text-[#6366f1] rounded-lg">
          <MapIcon size={20} />
        </div>
        <div className="truncate">
          <h4 className="font-bold truncate group-hover:text-[#6366f1] transition-colors">{map.name || 'Untitled'}</h4>
          <p className="text-xs text-gray-500">Edited recently</p>
        </div>
      </div>
    </div>
  );
};

export default MapCard;
