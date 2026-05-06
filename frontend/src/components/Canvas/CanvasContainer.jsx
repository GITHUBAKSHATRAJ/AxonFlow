import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { 
    ReactFlow, 
    Controls, 
    Background, 
    BackgroundVariant, 
    Panel,
    ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Components
import nodeTypes from './NodeRegistry';
import D3BezierEdge from './D3BezierEdge';
import ActionToolbar from './ActionToolbar';
import FloatingToolbar from './FloatingToolbar';
import BulkImportModal from '../Modals/BulkImportModal';
import * as nodeApi from '../../services/api/nodeApi';

// Hooks
import { useCanvasState } from './hooks/useCanvasState';
import { useCanvasEvents } from './hooks/useCanvasEvents';
import { useCanvasActions } from './hooks/useCanvasActions';
import { useDragReparent } from './hooks/useDragReparent';

const edgeTypes = { d3Bezier: D3BezierEdge };

const MindMapInner = ({ mapId, initialNodes, externalImportOpen, onCloseExternalImport }) => {
    // 1. Data & Layout State
    const {
        backendNodes,
        setBackendNodes,
        nodes,
        onNodesChange,
        edges,
        setEdges,
        onEdgesChange,
        layoutMode,
        setLayoutMode,
        colorPalette,
        setColorPalette
    } = useCanvasState(mapId, initialNodes);

    // Stable ref for backend nodes (used by recursive actions)
    const backendNodesRef = useRef(backendNodes);
    useEffect(() => { backendNodesRef.current = backendNodes; }, [backendNodes]);

    // 2. UI State
    const [focusedNodeId, setFocusedNodeId] = useState(null);
    const [hoveredNodeId, setHoveredNodeId] = useState(null);
    const [selectedNode, setSelectedNode] = useState(null);
    const [menuConfig, setMenuConfig] = useState(null);
    const [showPaletteMenu, setShowPaletteMenu] = useState(false);
    
    // Panel States
    const [notesOpen, setNotesOpen] = useState(false);
    const [linksOpen, setLinksOpen] = useState(false);
    const [filesOpen, setFilesOpen] = useState(false);
    const [aiOpen, setAiOpen] = useState(false);
    const [importOpen, setImportOpen] = useState(false);

    // 3. Business Actions
    const {
        openNodeInput,
        handleDeleteNode,
        handleCopy,
        handlePaste,
        openNotes,
        openLinks,
        openFiles,
        openAI
    } = useCanvasActions({
        mapId,
        setBackendNodes,
        backendNodesRef,
        setSelectedNode,
        setMenuConfig,
        setNotesOpen,
        setLinksOpen,
        setFilesOpen,
        setAiOpen
    });

    // 4. Drag-Reparent Logic
    const { dropTargetId, onNodeDrag, onNodeDragStop } = useDragReparent({
        mapId,
        backendNodes,
        setBackendNodes,
        rfNodes: nodes
    });

    // 5. Build Toolbar Actions
    const buildActions = useCallback((rfNode) => ({
        rename: () => openNodeInput('rename', rfNode),
        addChild: () => openNodeInput('child', rfNode),
        deleteNode: () => handleDeleteNode(rfNode.id, rfNode.data.name),
        copy: () => handleCopy(rfNode),
        paste: () => handlePaste(rfNode.id),
        import: () => {
            setFocusedNodeId(rfNode.id); // Ensure this node is the target
            setImportOpen(true);
        },
        openNotes: () => openNotes(rfNode),
        openLinks: () => openLinks(rfNode),
        openFiles: () => openFiles(rfNode),
        openAI: () => openAI(rfNode),
    }), [openNodeInput, handleDeleteNode, handleCopy, handlePaste, openNotes, openLinks, openFiles, openAI]);

    // ── Bulk Import Logic ──
    const handleBulkImport = useCallback(async (parsedNodes) => {
        // If no root is selected, we'll attach to the actual root of the map
        const targetParentId = focusedNodeId || backendNodes.find(n => !n.parentId)?.id;
        if (!targetParentId) {
            alert('Please select a parent node or create a root first.');
            return;
        }

        const nodesToCreate = parsedNodes.map(({ tempId, parentTempId, ...rest }) => ({
            ...rest,
            mapId,
            // If it has a parentTempId, find the new real ID of that parent in our list
            // But wait, insertMany returns new nodes with real IDs.
            // We need to preserve hierarchy.
        }));

        // Actually, let's keep it simple: 
        // 1. Generate real ObjectIds on frontend for all new nodes
        // 2. Map temp hierarchy to real IDs
        // 3. Insert all at once.

        const generateObjectId = () => [...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        const idMap = { null: targetParentId }; // Map null (top level of import) to the selected parent
        
        parsedNodes.forEach(n => {
            idMap[n.tempId] = generateObjectId();
        });

        const finalNodes = parsedNodes.map(n => ({
            _id: idMap[n.tempId],
            id: idMap[n.tempId],
            name: n.name,
            parentId: n.parentTempId ? idMap[n.parentTempId] : targetParentId,
            mapId,
            isExpanded: true
        }));

        try {
            const inserted = await nodeApi.bulkCreateNodes(finalNodes);
            setBackendNodes(prev => [
                ...prev.map(n => n.id === targetParentId ? { ...n, isExpanded: true } : n),
                ...(Array.isArray(inserted) ? inserted : []),
            ]);
            await nodeApi.updateNode(targetParentId, { isExpanded: true });
        } catch (err) {
            console.error('Bulk import failed:', err);
            throw err;
        }
    }, [mapId, focusedNodeId, backendNodes, setBackendNodes]);

    // 6. Interaction Events
    const {
        onHover,
        onHoverEnd,
        onNodeClick,
        onPaneClick
    } = useCanvasEvents({
        nodes,
        backendNodes,
        setEdges,
        setHoveredNodeId,
        setFocusedNodeId,
        setMenuConfig,
        openNodeInput,
        handleDeleteNode,
        handleNativePaste: (e) => {
            const text = e.clipboardData?.getData('text');
            if (text && focusedNodeId) handlePaste(focusedNodeId);
        },
        EDGE_HOVER: '#ff6600',
        EDGE_DEFAULT: '#555'
    });

    const onNodeContextMenu = useCallback((event, rfNode) => {
        event.preventDefault();
        setFocusedNodeId(rfNode.id);
        setMenuConfig({ 
            x: event.clientX, 
            y: event.clientY, 
            actions: buildActions(rfNode) 
        });
    }, [buildActions]);

    // 7. Final Node Enrichment for Rendering
    const styledNodes = useMemo(() => nodes.map(n => ({
        ...n,
        selected: n.id === focusedNodeId,
        data: {
            ...n.data,
            isHovered: n.id === hoveredNodeId,
            isDropTarget: n.id === dropTargetId,
            onHover,
            onHoverEnd
        }
    })), [nodes, focusedNodeId, hoveredNodeId, dropTargetId, onHover, onHoverEnd]);

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', background: '#121212' }}>
            <ReactFlow
                nodes={styledNodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                onNodeDrag={onNodeDrag}
                onNodeDragStop={onNodeDragStop}
                onNodeContextMenu={onNodeContextMenu}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                minZoom={0.05}
                maxZoom={2.5}
            >
                <Background variant={BackgroundVariant.Dots} color="#222" gap={20} />
                <Controls />
                
                <ActionToolbar 
                    layoutMode={layoutMode}
                    setLayoutMode={setLayoutMode}
                    colorPalette={colorPalette}
                    setColorPalette={setColorPalette}
                    showPaletteMenu={showPaletteMenu}
                    setShowPaletteMenu={setShowPaletteMenu}
                    onOpenImport={() => setImportOpen(true)}
                />

                <FloatingToolbar 
                    config={menuConfig} 
                    onClose={() => setMenuConfig(null)} 
                />

                {focusedNodeId && (
                    <Panel position="bottom-center">
                        <div style={{
                            background: 'rgba(24, 24, 42, 0.9)',
                            padding: '10px 20px',
                            borderRadius: '30px',
                            color: '#c68a00',
                            fontSize: '12px',
                            border: '1px solid rgba(198, 138, 0, 0.3)',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                            display: 'flex',
                            gap: '15px'
                        }}>
                            <span><kbd>Tab</kbd> Child</span>
                            <span><kbd>Enter</kbd> Sibling</span>
                            <span><kbd>F2</kbd> Rename</span>
                            <span><kbd>Del</kbd> Delete</span>
                        </div>
                    </Panel>
                )}
            </ReactFlow>

            {/* TODO: Integrate Notes, Links, Files, and AI Panels here */}
            
            {(importOpen || externalImportOpen) && (
                <BulkImportModal 
                    onClose={() => {
                        setImportOpen(false);
                        if (onCloseExternalImport) onCloseExternalImport();
                    }} 
                    onImport={handleBulkImport}
                />
            )}
        </div>
    );
};

const CanvasContainer = (props) => (
    <ReactFlowProvider>
        <MindMapInner {...props} />
    </ReactFlowProvider>
);

export default CanvasContainer;
