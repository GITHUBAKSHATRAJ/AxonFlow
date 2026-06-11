import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FolderPlus, Map as MapIcon } from 'lucide-react';
import GlobalSidebar from '../components/GlobalSidebar';
import * as mapApi from '../services/api/mapApi';
import * as folderApi from '../services/api/folderApi';

// Import refactored modular Workspace components
import WorkspaceHeader from '../components/Workspace/WorkspaceHeader';
import WorkspaceCard from '../components/Workspace/WorkspaceCard';
import FolderCard from '../components/Workspace/FolderCard';
import CreateItemModal from '../components/Workspace/CreateItemModal';

/**
 * [ARROW FUNCTION FOR SMALL UTILITY OPERATION]
 * Standard arrow function style is perfect for small, stateless math or utility actions.
 * This determines the visual background color style based on the unique map ID.
 */
const getGradientClass = (id) => {
  if (!id) return 'bg-grad-1';
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  const index = Math.abs(hash) % 6 + 1;
  return `bg-grad-${index}`;
};

/**
 * [PARENT COMPONENT / CONTAINER COMPONENT]
 * WorkspaceView is a Named Function component. We use Named Functions so the component is easy to identify
 * in debuggers and call stacks.
 * 
 * Concept: This is a "Container Component". It is responsible for managing State, calling APIs,
 * and passing down event handler actions to "Presentational (Child) Components" like WorkspaceCard and FolderCard.
 */
function WorkspaceView() {
    // [REACT HOOK: useParams]
    // Reads variable segments directly from the URL route structure (configured inside routes.jsx).
    const { workspaceName } = useParams();
    
    // [REACT HOOK: useNavigate]
    // Provides programmatic page routing actions to navigate between paths without triggering browser refreshes.
    const navigate = useNavigate();
    
    const decodedWorkspace = workspaceName ? decodeURIComponent(workspaceName) : null;

    // [REACT HOOK: useState (State Management)]
    // Sets up dynamic variables that React tracks. When we update these using the setter functions,
    // React triggers a re-render to update the user interface.
    const [loading, setLoading] = useState(true);
    const [workspaces, setWorkspaces] = useState([]);
    const [folders, setFolders] = useState([]);
    const [maps, setMaps] = useState([]);
    const [currentFolderId, setCurrentFolderId] = useState(null);
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const [viewMode, setViewMode] = useState('grid');

    // State controlling the custom overlay Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        title: '',
        placeholder: '',
        onSubmit: () => {}
    });

    // [REACT HOOK: useEffect (Lifecycle Method / Side Effects)]
    // Runs automatically when variables in the dependency array (decodedWorkspace, currentFolderId) change.
    // This fetches fresh data from the server database whenever the user navigates workspace paths.
    useEffect(function () {
        if (!decodedWorkspace) {
            loadWorkspaces();
        } else {
            loadWorkspaceContent();
        }
    }, [decodedWorkspace, currentFolderId]);

    // [NAMED FUNCTION] - Fetch all available Workspaces
    async function loadWorkspaces() {
        setLoading(true);
        try {
            const data = await folderApi.fetchWorkspaces();
            setWorkspaces(data || []);
        } catch (err) { 
            console.error(err); 
        } finally { 
            setLoading(false); 
        }
    }

    // [NAMED FUNCTION] - Fetch Folders and Standalone Maps within the active Workspace
    async function loadWorkspaceContent() {
        setLoading(true);
        try {
            const [fData, mData] = await Promise.all([
                folderApi.fetchFolders(decodedWorkspace, currentFolderId),
                mapApi.fetchAllMaps({ workspace: decodedWorkspace, folderId: currentFolderId })
            ]);
            setFolders((fData || []).filter(f => f.name !== '.workspace'));
            setMaps(mData || []);
        } catch (err) { 
            console.error(err); 
        } finally { 
            setLoading(false); 
        }
    }

    // [ARROW FUNCTION FOR SMALL UTILITY OPERATION]
    // Configures and opens the Workspace creation Modal
    const openCreateWorkspaceModal = () => {
        setModalConfig({
            title: 'Create New Workspace',
            placeholder: 'e.g. Design Ideas',
            onSubmit: async (name) => {
                try {
                    await folderApi.createFolder('.workspace', name, null);
                    loadWorkspaces();
                } catch (err) { console.error(err); }
            }
        });
        setIsModalOpen(true);
    };

    // [ARROW FUNCTION FOR SMALL UTILITY OPERATION]
    // Configures and opens the Folder creation Modal
    const openCreateFolderModal = () => {
        setModalConfig({
            title: 'Create New Folder',
            placeholder: 'e.g. Assets',
            onSubmit: async (name) => {
                try {
                    await folderApi.createFolder(name, decodedWorkspace, currentFolderId);
                    loadWorkspaceContent();
                } catch (err) { console.error(err); }
            }
        });
        setIsModalOpen(true);
    };

    // [ARROW FUNCTION FOR SMALL UTILITY OPERATION]
    // Configures and opens the Map creation Modal
    const openCreateMapModal = () => {
        setModalConfig({
            title: 'Create New Map',
            placeholder: 'e.g. Brainstorm Layout',
            onSubmit: async (name) => {
                try {
                    const res = await mapApi.createMap(name, decodedWorkspace, currentFolderId);
                    navigate(`/map/${res.id}`);
                } catch (err) { console.error(err); }
            }
        });
        setIsModalOpen(true);
    };

    // [NAMED FUNCTION] - Update active directory navigation states
    function navigateToFolder(folder) {
        setCurrentFolderId(folder.id);
        setBreadcrumbs(prev => [...prev, folder]);
    }

    // [NAMED FUNCTION] - Handle breadcrumb navigation clicks
    function navigateToBreadcrumb(index) {
        if (index === -1) {
            setCurrentFolderId(null);
            setBreadcrumbs([]);
        } else {
            const newBC = breadcrumbs.slice(0, index + 1);
            setBreadcrumbs(newBC);
            setCurrentFolderId(newBC[index].id);
        }
    }

    return (
        <div className="flex w-full h-screen bg-bg overflow-hidden text-text-h">
            <GlobalSidebar />

            <main className="flex-1 flex flex-col overflow-hidden">
                
                {/* 
                  [CHILD COMPONENT / PRESENTATIONAL COMPONENT]
                  WorkspaceHeader is a presenter component. We pass variables and callbacks 
                  down as "Props" (Properties). The child displays them and alerts this 
                  parent component when actions are clicked.
                */}
                <WorkspaceHeader 
                    decodedWorkspace={decodedWorkspace}
                    currentFolderId={currentFolderId}
                    breadcrumbs={breadcrumbs}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    onCreateClick={decodedWorkspace ? openCreateMapModal : openCreateWorkspaceModal}
                    navigateToBreadcrumb={navigateToBreadcrumb}
                />

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-12">
                    {loading ? (
                        <div className="py-20 text-center text-text-muted animate-pulse text-lg">Syncing workspace...</div>
                    ) : (
                        <div className={viewMode === 'grid' ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8" : "flex flex-col gap-3"}>
                            
                            {/* 
                              [DOM DIFFING & RECONCILIATION: key={w}]
                              When rendering dynamic lists, React needs a unique 'key' prop.
                              This key acts as a unique ID so React's DOM Diffing algorithm can check 
                              exactly which item was added, updated, or deleted, rather than re-rendering
                              the entire list from scratch.
                            */}
                            {!decodedWorkspace && workspaces.map(w => (
                                <WorkspaceCard 
                                    key={w}
                                    name={w}
                                    onClick={() => navigate(`/workspaces/${encodeURIComponent(w)}`)}
                                />
                            ))}

                            {/* Render Content of a Workspace */}
                            {decodedWorkspace && (
                                <>
                                    {/* Folders List */}
                                    {folders.map(f => (
                                        <FolderCard 
                                            key={f.id}
                                            folder={f}
                                            onClick={() => navigateToFolder(f)}
                                        />
                                    ))}

                                    {/* Maps List */}
                                    {maps.map(map => (
                                        <div 
                                            key={map.id}
                                            onClick={() => navigate(`/map/${map.id}`)}
                                            className="group flex flex-col items-center gap-3 cursor-pointer"
                                        >
                                            <div className={`w-full aspect-square rounded-2xl ${getGradientClass(map.id)} flex items-center justify-center transition-all group-hover:-translate-y-1 shadow-lg`}>
                                                <MapIcon size={40} className="text-text-h/80 group-hover:scale-110 transition-transform" />
                                            </div>
                                            <span className="font-semibold text-sm text-text-muted group-hover:text-text-h truncate w-full text-center">{map.name || 'Untitled'}</span>
                                        </div>
                                    ))}
                                    
                                    {/* Empty Folder State */}
                                    {folders.length === 0 && maps.length === 0 && (
                                        <div className="col-span-full py-32 flex flex-col items-center justify-center border border-dashed border-border rounded-[32px] text-text-muted gap-4">
                                            <div onClick={openCreateFolderModal} className="w-16 h-16 bg-bg-card rounded-full flex items-center justify-center text-gray-700 cursor-pointer hover:bg-bg-card-hover hover:text-accent transition-all">
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

            {/* Custom Input Modal Overlay */}
            <CreateItemModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalConfig.title}
                placeholder={modalConfig.placeholder}
                onSubmit={modalConfig.onSubmit}
            />
        </div>
    );
}

export default WorkspaceView;
