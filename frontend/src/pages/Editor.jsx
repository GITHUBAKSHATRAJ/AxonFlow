// Reviewd on 25 may 2026
import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import CanvasContainer from '../components/Canvas/CanvasContainer';
import TopBar from '../components/TopBar';
import * as nodeApi from '../services/api/nodeApi';
import * as mapApi from '../services/api/mapApi';
import BulkImportModal from '../components/Modals/BulkImportModal';

/**
 * [CONTAINER / NAMED COMPONENT]
 * Editor is a Named Function component that operates as a workspace environment.
 */
function Editor() {
    const { id } = useParams();
    
    // [STATE HOOKS]
    const [backendNodes, setBackendNodes] = useState([]);
    const [mapName, setMapName] = useState('Loading...');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);

    // Monitoring side-effect to log state changes
    useEffect(function () {
        console.log("Current backendNodes:", backendNodes);
    }, [backendNodes]);

    // [REACT HOOK: useEffect]
    // Fetches initial mind map nodes from the database during component mount
    useEffect(function () {
        if (!id) return;
        setIsLoading(true);
        
        nodeApi.fetchMapNodes(id)
            .then(data => {
                setBackendNodes(data);
                const root = data.find(n => !n.parentId); 
                setMapName(root ? root.name : 'Untitled Map');
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Failed to load map nodes:', err);
                setIsLoading(false);
            });
    }, [id]);

    // [REACT HOOK: useCallback (Performance Optimization)]
    // Memoizes the named callback function to prevent it from being re-created on every render.
    // This stops child components (like TopBar) from rendering again unnecessarily.
    const handleUpdateMapName = useCallback(async function (newName) {
        setMapName(newName);
        setIsSaving(true);
        // Optimistic State Update:
        setBackendNodes(prev =>
            prev.map(n => (!n.parentId ? { ...n, name: newName } : n))
        );
        try {
            await mapApi.updateMapAttributes(id, { name: newName });
        } catch (err) {
            console.error('Rename error:', err);
        } finally {
            setIsSaving(false);
        }
    }, [id]);

    return (
        <div className="w-screen h-screen overflow-hidden bg-bg text-text-h relative">
            <TopBar 
                mapName={mapName}
                onUpdateMapName={handleUpdateMapName}
                isSaving={isSaving}
                onBulkImport={() => setIsImportOpen(true)}
            />

            <div className="w-full h-full pt-[60px] box-border relative">
                {/* [CONDITIONAL RENDERING] */}
                {isLoading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg z-50">
                        <div className="text-5xl mb-6 animate-bounce">🧠</div>
                        <div className="text-lg font-bold text-accent animate-pulse uppercase tracking-[0.2em]">Syncing AxonFlow...</div>
                    </div>
                ) : ( 
                    /* Primary child interactive canvas viewport */
                    <CanvasContainer 
                        mapId={id} 
                        initialNodes={backendNodes} 
                        externalImportOpen={isImportOpen} 
                        onCloseExternalImport={() => setIsImportOpen(false)} 
                    />
                )}
            </div>
        </div>
    );
}

export default Editor;
