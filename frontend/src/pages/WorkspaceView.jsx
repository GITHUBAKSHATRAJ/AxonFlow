import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Folder, ArrowLeft, Plus, FolderPlus, Map as MapIcon, 
    MoreVertical, Edit2, Trash2, LayoutGrid, List, X, Search, 
    ChevronRight, Star
} from 'lucide-react';
import GlobalSidebar from '../components/GlobalSidebar';
import * as mapApi from '../services/api/mapApi';
import * as folderApi from '../services/api/folderApi';

const getGradientClass = (id) => {
  if (!id) return 'bg-grad-1';
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  const index = Math.abs(hash) % 6 + 1;
  return `bg-grad-${index}`;
};

const WorkspaceView = () => {
    const { workspaceName } = useParams();
    const navigate = useNavigate();
    const decodedWorkspace = workspaceName ? decodeURIComponent(workspaceName) : null;

    const [loading, setLoading] = useState(true);
    const [workspaces, setWorkspaces] = useState([]);
    const [folders, setFolders] = useState([]);
    const [maps, setMaps] = useState([]);
    const [currentFolderId, setCurrentFolderId] = useState(null);
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const [viewMode, setViewMode] = useState('grid');

    useEffect(() => {
        if (!decodedWorkspace) {
            loadWorkspaces();
        } else {
            loadWorkspaceContent();
        }
    }, [decodedWorkspace, currentFolderId]);

    const loadWorkspaces = async () => {
        setLoading(true);
        try {
            const data = await folderApi.fetchWorkspaces();
            setWorkspaces(data || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const loadWorkspaceContent = async () => {
        setLoading(true);
        try {
            const [fData, mData] = await Promise.all([
                folderApi.fetchFolders(decodedWorkspace, currentFolderId),
                mapApi.fetchAllMaps({ workspace: decodedWorkspace, folderId: currentFolderId })
            ]);
            setFolders((fData || []).filter(f => f.name !== '.workspace'));
            setMaps(mData || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleCreateWorkspace = async () => {
        const name = prompt('New Workspace Name:');
        if (name?.trim()) {
            try {
                await folderApi.createFolder('.workspace', name.trim(), null);
                loadWorkspaces();
            } catch (err) { console.error(err); }
        }
    };

    const handleCreateFolder = async () => {
        const name = prompt('New Folder Name:');
        if (name?.trim()) {
            try {
                await folderApi.createFolder(name.trim(), decodedWorkspace, currentFolderId);
                loadWorkspaceContent();
            } catch (err) { console.error(err); }
        }
    };

    const handleCreateMap = async () => {
        const name = prompt('New Map Name:');
        if (name?.trim()) {
            try {
                const res = await mapApi.createMap(name.trim(), decodedWorkspace, currentFolderId);
                navigate(`/map/${res.id}`);
            } catch (err) { console.error(err); }
        }
    };

    const navigateToFolder = (folder) => {
        setCurrentFolderId(folder.id);
        setBreadcrumbs(prev => [...prev, folder]);
    };

    const navigateToBreadcrumb = (index) => {
        if (index === -1) {
            setCurrentFolderId(null);
            setBreadcrumbs([]);
        } else {
            const newBC = breadcrumbs.slice(0, index + 1);
            setBreadcrumbs(newBC);
            setCurrentFolderId(newBC[index].id);
        }
    };

    return (
        <div className="flex w-full h-screen bg-[#0f111a] overflow-hidden text-white">
            <GlobalSidebar />

            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Custom Navigation Bar */}
                <header className="h-[72px] shrink-0 border-b border-[#2a2f3e] bg-[#1a1d27]/50 backdrop-blur-xl flex items-center justify-between px-12">
                    <div className="flex items-center gap-4 text-sm">
                        <button 
                            onClick={() => decodedWorkspace ? (currentFolderId ? navigateToBreadcrumb(-1) : navigate('/workspaces')) : navigate('/')}
                            className="p-2 hover:bg-[#222634] rounded-lg text-gray-400 hover:text-white transition-all"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        
                        <div className="h-6 w-px bg-gray-800" />
                        
                        <div className="flex items-center gap-2">
                            <span 
                                onClick={() => navigate('/workspaces')}
                                className={`cursor-pointer hover:text-[#6366f1] transition-colors ${!decodedWorkspace ? 'text-white font-bold' : 'text-gray-500'}`}
                            >
                                Workspaces
                            </span>
                            {decodedWorkspace && (
                                <>
                                    <ChevronRight size={14} className="text-gray-700" />
                                    <span 
                                        onClick={() => navigateToBreadcrumb(-1)}
                                        className={`cursor-pointer hover:text-[#6366f1] transition-colors ${!currentFolderId ? 'text-white font-bold' : 'text-gray-500'}`}
                                    >
                                        {decodedWorkspace}
                                    </span>
                                </>
                            )}
                            {breadcrumbs.map((bc, idx) => (
                                <React.Fragment key={bc.id}>
                                    <ChevronRight size={14} className="text-gray-700" />
                                    <span 
                                        onClick={() => navigateToBreadcrumb(idx)}
                                        className={`cursor-pointer hover:text-[#6366f1] transition-colors ${idx === breadcrumbs.length - 1 ? 'text-white font-bold' : 'text-gray-500'}`}
                                    >
                                        {bc.name}
                                    </span>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                         <div className="flex bg-[#1a1d27] border border-[#2a2f3e] rounded-lg p-1">
                            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-[#222634] text-[#6366f1]' : 'text-gray-500'}`}><LayoutGrid size={16} /></button>
                            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-[#222634] text-[#6366f1]' : 'text-gray-500'}`}><List size={16} /></button>
                        </div>
                        <button 
                            onClick={decodedWorkspace ? handleCreateMap : handleCreateWorkspace}
                            className="bg-[#6366f1] hover:bg-[#4f46e5] text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#6366f1]/20 active:translate-y-px"
                        >
                            <Plus size={16} /> New {decodedWorkspace ? 'Map' : 'Workspace'}
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-12">
                    {loading ? (
                        <div className="py-20 text-center text-gray-500 animate-pulse text-lg">Syncing workspace...</div>
                    ) : (
                        <div className={viewMode === 'grid' ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8" : "flex flex-col gap-3"}>
                            
                            {/* Render Workspaces (if no workspace selected) */}
                            {!decodedWorkspace && workspaces.map(w => (
                                <div 
                                    key={w}
                                    onClick={() => navigate(`/workspaces/${encodeURIComponent(w)}`)}
                                    className="group flex flex-col items-center gap-3 cursor-pointer"
                                >
                                    <div className="w-full aspect-square bg-gradient-to-br from-[#1d4ed8] to-[#3b82f6] rounded-[24px] rounded-tl-[12px] flex items-center justify-center shadow-xl group-hover:-translate-y-2 group-hover:shadow-[#1d4ed8]/40 transition-all border-l-[10px] border-black/20">
                                        <Folder size={48} className="text-white group-hover:scale-110 transition-transform" />
                                    </div>
                                    <span className="font-bold text-gray-300 group-hover:text-white transition-colors">{w}</span>
                                </div>
                            ))}

                            {/* Render Content of a Workspace */}
                            {decodedWorkspace && (
                                <>
                                    {folders.map(f => (
                                        <div 
                                            key={f.id}
                                            onClick={() => navigateToFolder(f)}
                                            className="group flex flex-col items-center gap-3 cursor-pointer"
                                        >
                                            <div className="w-full aspect-square bg-[#1a1d27] border border-[#2a2f3e] group-hover:border-[#6366f1] rounded-2xl flex items-center justify-center transition-all group-hover:-translate-y-1">
                                                <Folder size={40} className="text-[#6366f1] group-hover:scale-110 transition-transform" />
                                            </div>
                                            <span className="font-semibold text-sm text-gray-400 group-hover:text-white truncate w-full text-center">{f.name}</span>
                                        </div>
                                    ))}

                                    {maps.map(map => (
                                        <div 
                                            key={map.id}
                                            onClick={() => navigate(`/map/${map.id}`)}
                                            className="group flex flex-col items-center gap-3 cursor-pointer"
                                        >
                                            <div className={`w-full aspect-square rounded-2xl ${getGradientClass(map.id)} flex items-center justify-center transition-all group-hover:-translate-y-1 shadow-lg`}>
                                                <MapIcon size={40} className="text-white/80 group-hover:scale-110 transition-transform" />
                                            </div>
                                            <span className="font-semibold text-sm text-gray-400 group-hover:text-white truncate w-full text-center">{map.name || 'Untitled'}</span>
                                        </div>
                                    ))}
                                    
                                    {folders.length === 0 && maps.length === 0 && (
                                        <div className="col-span-full py-32 flex flex-col items-center justify-center border border-dashed border-[#2a2f3e] rounded-[32px] text-gray-500 gap-4">
                                            <div onClick={handleCreateFolder} className="w-16 h-16 bg-[#1a1d27] rounded-full flex items-center justify-center text-gray-700 cursor-pointer hover:bg-[#222634] hover:text-[#6366f1] transition-all">
                                                <FolderPlus size={32} />
                                            </div>
                                            <p className="text-lg">Empty folder. Create your first map or sub-folder.</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default WorkspaceView;
