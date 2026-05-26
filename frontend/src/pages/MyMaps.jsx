import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Plus, Search, MoreVertical, Edit2, Trash2, Map as MapIcon, 
    Star, LayoutGrid, List, Copy, Download, RotateCcw 
} from 'lucide-react';
import GlobalSidebar from '../components/GlobalSidebar';
import MapCard from '../components/UI/MapCard';
import * as mapApi from '../services/api/mapApi';

// Utility getGradientClass moved to MapCard.jsx

const MyMaps = ({ filter = 'all' }) => {
    const navigate = useNavigate(); // const will not change 
    const [maps, setMaps] = useState([]); // useState retrun variabl map ,and function setMap to work on variable map , default value will be empty array 
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
            else if (filter === 'shared') params.isShared = true;
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
        shared: 'Shared with Me',
        trash: 'Trash'
    };

    const filteredMaps = maps.filter(m => (m.name || '').toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="flex w-full h-screen bg-bg overflow-hidden text-text-h">
            <GlobalSidebar />

            <main className="flex-1 overflow-y-auto p-12 lg:p-16">
                {/* Header */}
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-text-h mb-2">{titleMap[filter]}</h1>
                        <p className="text-text-muted text-lg">
                            {filter === 'trash' ? 'Items here will be permanently deleted after 30 days.' : 'Manage and organize your standalone mind maps.'}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative w-64">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                            <input 
                                type="text" 
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-bg-card border border-border rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:border-border-focus transition-all"
                            />
                        </div>
                        <div className="flex bg-bg-card border border-border rounded-lg p-1">
                            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-bg-card-hover text-accent' : 'text-text-muted'}`}><LayoutGrid size={16} /></button>
                            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-bg-card-hover text-accent' : 'text-text-muted'}`}><List size={16} /></button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 text-center text-text-muted animate-pulse text-lg">Loading items...</div>
                ) : filteredMaps.length === 0 ? (
                    <div className="py-32 flex flex-col items-center justify-center border border-dashed border-border rounded-[32px] text-text-muted gap-4">
                        <div className="w-16 h-16 bg-bg-card rounded-full flex items-center justify-center text-gray-700">
                            <MapIcon size={32} />
                        </div>
                        <p className="text-lg">No maps found in this section.</p>
                    </div>
                ) : (
                    <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col gap-3"}>
                        {filteredMaps.map(map => (
                            <MapCard 
                                key={map.id} 
                                map={map}
                                viewMode={viewMode}
                                isTrash={filter === 'trash'}
                                onClick={() => filter !== 'trash' && navigate(`/map/${map.id}`)}
                                onTogglePin={toggleFavorite}
                                onRestore={handleRestore}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyMaps;
