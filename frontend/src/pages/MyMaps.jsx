import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Plus, Search, MoreVertical, Edit2, Trash2, Map as MapIcon, 
    Star, LayoutGrid, List, Copy, Download, RotateCcw 
} from 'lucide-react';
import GlobalSidebar from '../components/GlobalSidebar';
import * as mapApi from '../services/api/mapApi';

const getGradientClass = (id) => {
  if (!id) return 'bg-grad-1';
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  const index = Math.abs(hash) % 6 + 1;
  return `bg-grad-${index}`;
};

const MyMaps = ({ filter = 'all' }) => {
    const navigate = useNavigate();
    const [maps, setMaps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [activeDropdown, setActiveDropdown] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        loadMaps();
    }, [filter]);

    const loadMaps = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filter === 'trash') params.isTrashed = true;
            else if (filter === 'favorites') params.isFavorite = true;
            else params.isTrashed = false;

            const data = await mapApi.fetchAllMaps(params);
            setMaps(data || []);
        } catch (err) {
            console.error('Failed to load maps:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async (e, map) => {
        e.stopPropagation();
        try {
            await mapApi.updateMapAttributes(map.id, { isTrashed: false });
            loadMaps();
        } catch (err) { console.error('Restore failed:', err); }
    };

    const handlePermanentDelete = async (e, map) => {
        e.stopPropagation();
        if (window.confirm('Permanently delete this map? This cannot be undone.')) {
            // mapApi.deleteMap(map.id)... we'll need to implement this in nodeApi/mapApi
            loadMaps();
        }
    };

    const handleTrash = async (e, map) => {
        e.stopPropagation();
        try {
            await mapApi.updateMapAttributes(map.id, { isTrashed: true });
            loadMaps();
        } catch (err) { console.error('Trash failed:', err); }
    };

    const toggleFavorite = async (e, map) => {
        e.stopPropagation();
        const nextVal = !map.isFavorite;
        setMaps(prev => prev.map(m => m.id === map.id ? { ...m, isFavorite: nextVal } : m));
        try {
            await mapApi.updateMapAttributes(map.id, { isFavorite: nextVal });
        } catch (err) { console.error('Pin failed:', err); }
    };

    const titleMap = {
        all: 'My Maps',
        favorites: 'Favorites',
        trash: 'Trash'
    };

    const filteredMaps = maps.filter(m => (m.name || '').toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="flex w-full h-screen bg-[#0f111a] overflow-hidden text-white">
            <GlobalSidebar />

            <main className="flex-1 overflow-y-auto p-12 lg:p-16">
                {/* Header */}
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">{titleMap[filter]}</h1>
                        <p className="text-gray-400 text-lg">
                            {filter === 'trash' ? 'Items here will be permanently deleted after 30 days.' : 'Manage and organize your standalone mind maps.'}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative w-64">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input 
                                type="text" 
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#1a1d27] border border-[#2a2f3e] rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:border-[#6366f1] transition-all"
                            />
                        </div>
                        <div className="flex bg-[#1a1d27] border border-[#2a2f3e] rounded-lg p-1">
                            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-[#222634] text-[#6366f1]' : 'text-gray-500'}`}><LayoutGrid size={16} /></button>
                            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-[#222634] text-[#6366f1]' : 'text-gray-500'}`}><List size={16} /></button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 text-center text-gray-500 animate-pulse text-lg">Loading items...</div>
                ) : filteredMaps.length === 0 ? (
                    <div className="py-32 flex flex-col items-center justify-center border border-dashed border-[#2a2f3e] rounded-[32px] text-gray-500 gap-4">
                        <div className="w-16 h-16 bg-[#1a1d27] rounded-full flex items-center justify-center text-gray-700">
                            <MapIcon size={32} />
                        </div>
                        <p className="text-lg">No maps found in this section.</p>
                    </div>
                ) : (
                    <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col gap-3"}>
                        {filteredMaps.map(map => (
                            <div 
                                key={map.id} 
                                onClick={() => filter !== 'trash' && navigate(`/map/${map.id}`)}
                                className={`
                                    group bg-[#1a1d27] border border-[#2a2f3e] hover:border-[#6366f1] rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1 shadow-lg
                                    ${viewMode === 'list' ? 'flex items-center justify-between p-4' : ''}
                                `}
                            >
                                {viewMode === 'grid' ? (
                                    <>
                                        <div className={`h-28 w-full relative ${getGradientClass(map.id)}`}>
                                            {filter !== 'trash' && (
                                                <button 
                                                    onClick={(e) => toggleFavorite(e, map)}
                                                    className="absolute top-3 right-3 p-2 bg-black/20 backdrop-blur-md rounded-lg text-white hover:bg-black/40 transition-colors"
                                                >
                                                    <Star size={16} fill={map.isFavorite ? '#ffd700' : 'none'} className={map.isFavorite ? 'text-[#ffd700]' : 'text-white'} />
                                                </button>
                                            )}
                                        </div>
                                        <div className="p-5 flex items-center justify-between">
                                            <div className="flex items-center gap-4 truncate">
                                                <div className="p-2 bg-[#6366f1]/10 text-[#6366f1] rounded-lg shrink-0">
                                                    <MapIcon size={18} />
                                                </div>
                                                <h4 className="font-bold truncate group-hover:text-[#6366f1] transition-colors">{map.name || 'Untitled'}</h4>
                                            </div>
                                            {filter === 'trash' ? (
                                                <button onClick={(e) => handleRestore(e, map)} className="text-gray-500 hover:text-green-500 transition-colors" title="Restore"><RotateCcw size={16} /></button>
                                            ) : (
                                                <button onClick={(e) => handleTrash(e, map)} className="text-gray-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-4 truncate flex-1">
                                            <div className={`w-8 h-8 rounded-lg ${getGradientClass(map.id)} shrink-0`} />
                                            <div className="p-1.5 bg-[#6366f1]/10 text-[#6366f1] rounded-md shrink-0">
                                                <MapIcon size={14} />
                                            </div>
                                            <h4 className="font-bold truncate group-hover:text-[#6366f1] transition-colors">{map.name || 'Untitled'}</h4>
                                        </div>
                                        <div className="flex items-center gap-6 text-gray-500">
                                            <span className="text-xs hidden md:block">Edited 2h ago</span>
                                            {filter === 'trash' ? (
                                                <button onClick={(e) => handleRestore(e, map)} className="hover:text-green-500 transition-colors"><RotateCcw size={18} /></button>
                                            ) : (
                                                <>
                                                    <button onClick={(e) => toggleFavorite(e, map)} className={`hover:text-[#ffd700] transition-colors ${map.isFavorite ? 'text-[#ffd700]' : ''}`}><Star size={18} fill={map.isFavorite ? '#ffd700' : 'none'} /></button>
                                                    <button onClick={(e) => handleTrash(e, map)} className="hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                                </>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyMaps;
