import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Search, Map as MapIcon, 
    LayoutGrid, List 
} from 'lucide-react';
import GlobalSidebar from '../components/GlobalSidebar';
import MapCard from '../components/UI/MapCard';
import * as mapApi from '../services/api/mapApi';

/**
 * [CONTAINER / NAMED COMPONENT]
 * MyMaps is a container page using Named Function syntax for easy debugging.
 * It uses Object Destructuring to parse the 'filter' prop and assigns it a default value of 'all'.
 */
function MyMaps({ filter = 'all' }) {
    const navigate = useNavigate();

    // [REACT HOOK: useState]
    // Declares state arrays and update triggers. Updating these causes React to re-render the view automatically.
    const [maps, setMaps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');

    // [REACT HOOK: useEffect]
    // Runs 'loadMaps()' automatically on page mount and whenever the 'filter' prop changes.
    useEffect(function () {
        loadMaps();
    }, [filter]);

    // [NAMED FUNCTION] - Fetch map elements from API
    async function loadMaps() {
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
    }

    // [NAMED FUNCTION] - Restore a soft-deleted map
    async function handleRestore(e, map) {
        e.stopPropagation(); // Stops the click event from bubbling up to parents
        try {
            await mapApi.updateMapAttributes(map.id, { isTrashed: false });
            loadMaps();
        } catch (err) { 
            console.error('Restore failed:', err); 
        }
    }

    // [NAMED FUNCTION] - Permanently delete a map
    async function handlePermanentDelete(e, map) {
        e.stopPropagation();
        if (window.confirm('Permanently delete this map? This cannot be undone.')) {
            // Future deletion API implementation endpoint
            loadMaps();
        }
    }

    // [NAMED FUNCTION] - Soft-delete (trash) a map
    async function handleTrash(e, map) {
        e.stopPropagation();
        try {
            await mapApi.updateMapAttributes(map.id, { isTrashed: true });
            loadMaps();
        } catch (err) { 
            console.error('Trash failed:', err); 
        }
    }

    // [NAMED FUNCTION] - Toggle Favorite state status
    async function toggleFavorite(e, map) {
        e.stopPropagation();
        const nextVal = !map.isFavorite;
        // Optimistic State Update (instantly update UI variables, then send network request)
        setMaps(prev => prev.map(m => m.id === map.id ? { ...m, isFavorite: nextVal } : m));
        try {
            await mapApi.updateMapAttributes(map.id, { isFavorite: nextVal });
        } catch (err) { 
            console.error('Pin failed:', err); 
        }
    }

    // Standard static lookup dictionary mapping filter categories to display titles
    const titleMap = {
        all: 'My Maps',
        favorites: 'Favorites',
        shared: 'Shared with Me',
        trash: 'Trash'
    };

    // Filter elements in memory dynamically based on search box keystrokes
    const filteredMaps = maps.filter(m => (m.name || '').toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="flex w-full h-screen bg-bg overflow-hidden text-text-h">
            <GlobalSidebar />

            <main className="flex-1 overflow-y-auto p-12 lg:p-16">
                {/* Page Header Header */}
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-text-h mb-2">{titleMap[filter]}</h1>
                        <p className="text-text-muted text-lg">
                            {filter === 'trash' ? 'Items here will be permanently deleted after 30 days.' : 'Manage and organize your standalone mind maps.'}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search Input Box */}
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
                        {/* Grid vs List View Mode Selectors */}
                        <div className="flex bg-bg-card border border-border rounded-lg p-1">
                            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-bg-card-hover text-accent' : 'text-text-muted'}`}><LayoutGrid size={16} /></button>
                            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-bg-card-hover text-accent' : 'text-text-muted'}`}><List size={16} /></button>
                        </div>
                    </div>
                </div>

                {/* Loading State Render */}
                {loading ? (
                    <div className="py-20 text-center text-text-muted animate-pulse text-lg">Loading items...</div>
                ) : filteredMaps.length === 0 ? (
                    /* Empty Content Placeholder State */
                    <div className="py-32 flex flex-col items-center justify-center border border-dashed border-border rounded-[32px] text-text-muted gap-4">
                        <div className="w-16 h-16 bg-bg-card rounded-full flex items-center justify-center text-gray-700">
                            <MapIcon size={32} />
                        </div>
                        <p className="text-lg">No maps found in this section.</p>
                    </div>
                ) : (
                    /* 
                      [DOM DIFFING & RECONCILIATION - MapCard key={map.id}]
                      React uses the unique 'key' to track list mutations. 
                      Passing down handlers like 'onTogglePin' propagates actions back to this parent.
                    */
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
                                onDelete={handlePermanentDelete}
                                onTrash={handleTrash}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default MyMaps;
