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
import ErrorBoundary from '../UI/ErrorBoundary';
import * as nodeApi from '../../services/api/nodeApi';

// Hooks
import { useCanvasState } from './hooks/useCanvasState';
import { useCanvasEvents } from './hooks/useCanvasEvents';
import { useCanvasActions } from './hooks/useCanvasActions';
import { useDragReparent } from './hooks/useDragReparent';

const edgeTypes = { d3Bezier: D3BezierEdge };

/**
 * [CHILD / NAMED COMPONENT]
 * MindMapInner is a Named Function component containing React Flow canvas handlers.
 * 
 * Concept: It binds custom Hooks together, manages local layout flags, 
 * and feeds variables to React Flow renderers.
 */
function MindMapInner({ mapId, initialNodes, externalImportOpen, onCloseExternalImport }) {
    // [STATE HOOK: useCanvasState]
    // Fetches reactive structures, calculates D3 trees layouts, and maps positions.
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

    // [REACT HOOK: useRef (Reference Persistence)]
    // Holds a persistent reference to backend nodes. This reference does not cause
    // re-renders when updated, providing a thread-safe way for hooks to read fresh arrays.
    const backendNodesRef = useRef(backendNodes);
    useEffect(function () { 
        backendNodesRef.current = backendNodes; 
    }, [backendNodes]);

    // [LOCAL STATE HOOKS]
    const [focusedNodeId, setFocusedNodeId] = useState(null);
    const [hoveredNodeId, setHoveredNodeId] = useState(null);
    const [selectedNode, setSelectedNode] = useState(null);
    const [menuConfig, setMenuConfig] = useState(null);
    const [showPaletteMenu, setShowPaletteMenu] = useState(false);
    
    // Panel visibility flags
    const [notesOpen, setNotesOpen] = useState(false);
    const [linksOpen, setLinksOpen] = useState(false);
    const [filesOpen, setFilesOpen] = useState(false);
    const [aiOpen, setAiOpen] = useState(false);
    const [importOpen, setImportOpen] = useState(false);

    // [CUSTOM STATE HOOK: useCanvasActions]
    // Connects canvas mutations to API endpoints and state-hooks updates.
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

    // [CUSTOM STATE HOOK: useDragReparent]
    // Intercepts node drag/drop actions to change node parenting.
    const { dropTargetId, onNodeDrag, onNodeDragStop } = useDragReparent({
        mapId,
        backendNodes,
        setBackendNodes,
        rfNodes: nodes
    });

    // [REACT HOOK: useCallback]
    // Caches action list generation to prevent rebuilding context handlers on every draw.
    const buildActions = useCallback(function (rfNode) {
        return {
            rename: () => openNodeInput('rename', rfNode),
            addChild: () => openNodeInput('child', rfNode),
            deleteNode: () => handleDeleteNode(rfNode.id, rfNode.data.name),
            copy: () => handleCopy(rfNode),
            paste: () => handlePaste(rfNode.id),
            import: () => {
                setFocusedNodeId(rfNode.id);
                setImportOpen(true);
            },
            openNotes: () => openNotes(rfNode),
            openLinks: () => openLinks(rfNode),
            openFiles: () => openFiles(rfNode),
            openAI: () => openAI(rfNode),
        };
    }, [openNodeInput, handleDeleteNode, handleCopy, handlePaste, openNotes, openLinks, openFiles, openAI]);

    // [REACT HOOK: useCallback]
    // Processes dynamic text parsing and calls bulk database insertion.
    const handleBulkImport = useCallback(async function (parsedNodes) {
        const targetParentId = focusedNodeId || backendNodes.find(n => !n.parentId)?.id;
        if (!targetParentId) {
            alert('Please select a parent node or create a root first.');
            return;
        }

        const generateObjectId = () => [...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        const idMap = { null: targetParentId };
        
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

    // [CUSTOM STATE HOOK: useCanvasEvents]
    // Manages click/keyboard shortcuts (Enter, Tab) within the viewport.
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
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
            const text = e.clipboardData?.getData('text');
            if (text && focusedNodeId) handlePaste(focusedNodeId);
        },
        EDGE_HOVER: '#ff6600',
        EDGE_DEFAULT: '#555'
    });

    // Handle context menu clicks to position the options menu
    const onNodeContextMenu = useCallback(function (event, rfNode) {
        event.preventDefault();
        setFocusedNodeId(rfNode.id);
        setMenuConfig({ 
            x: event.clientX, 
            y: event.clientY, 
            actions: buildActions(rfNode) 
        });
    }, [buildActions]);

    // [REACT HOOK: useMemo (Performance Optimization)]
    // Enriches nodes with hover and drop target data only when node lists change,
    // avoiding heavy object creation cycles during canvas panning.
    const styledNodes = useMemo(function () {
        return nodes.map(n => ({
            ...n,
            selected: n.id === focusedNodeId,
            data: {
                ...n.data,
                isHovered: n.id === hoveredNodeId,
                isDropTarget: n.id === dropTargetId,
                onHover,
                onHoverEnd
            }
        }));
    }, [nodes, focusedNodeId, hoveredNodeId, dropTargetId, onHover, onHoverEnd]);

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
}

/**
 * [CONTAINER COMPONENT]
 * CanvasContainer wraps ReactFlow elements inside boundary contexts.
 * 
 * Concept: Utilizes '<ReactFlowProvider>' to establish coordinates contexts, 
 * and '<ErrorBoundary>' to prevent total app crashes on canvas errors.
 */
function CanvasContainer(props) {
    return (
        <ErrorBoundary>
            <ReactFlowProvider>
                <MindMapInner {...props} />
            </ReactFlowProvider>
        </ErrorBoundary>
    );
}

export default CanvasContainer;
