// Reviewd on 25 may 2026

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import CanvasContainer from '../components/Canvas/CanvasContainer';
import TopBar from '../components/TopBar';
import * as nodeApi from '../services/api/nodeApi';
import * as mapApi from '../services/api/mapApi';
import BulkImportModal from '../components/Modals/BulkImportModal';

const Editor = () => {
    const { id } = useParams();
    const [backendNodes, setBackendNodes] = useState([]); //holds the flattened array of all nodes for the current map, fetched directly from  database.
    const [mapName, setMapName] = useState('Loading...');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);

    // Add this to monitor the state of backendNodes
    useEffect(() => {
        console.log("Current backendNodes:", backendNodes);
    }, [backendNodes]);

    // Load Map Data from our new modular API
    useEffect(() => {
        if (!id) return;
        setIsLoading(true);
        
        nodeApi.fetchMapNodes(id)
            .then(data => {
                setBackendNodes(data);
                const root = data.find(n => !n.parentId); //finding the root name 
                setMapName(root ? root.name : 'Untitled Map');
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Failed to load map nodes:', err);
                setIsLoading(false);
            });
    }, [id]);

    const handleUpdateMapName = useCallback(async (newName) => {
        setMapName(newName);
        setIsSaving(true);
        // Optimistically update root node name in the list
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
                {isLoading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg z-50">
                        <div className="text-5xl mb-6 animate-bounce">🧠</div>
                        <div className="text-lg font-bold text-accent animate-pulse uppercase tracking-[0.2em]">Syncing AxonFlow...</div>
                    </div>
                ) : ( // the flattened array is passed down to canvasContainer (bckendNodes)
                    <CanvasContainer //This is the Main component that renders the entire Mind Map UI, including the custom nodes, edges, sidebar, and tools
                        mapId={id} //Current map ID
                        initialNodes={backendNodes} //array of all nodes and edges for this map
                        externalImportOpen={isImportOpen} //toggle for import modal
                        onCloseExternalImport={() => setIsImportOpen(false)} //function to close modal
                    />
                )}
            </div>
        </div>
    );
};

export default Editor;
