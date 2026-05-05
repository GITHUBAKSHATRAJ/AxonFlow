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

// Hooks
import { useCanvasState } from './hooks/useCanvasState';
import { useCanvasEvents } from './hooks/useCanvasEvents';
import { useCanvasActions } from './hooks/useCanvasActions';
import { useDragReparent } from './hooks/useDragReparent';

const edgeTypes = { d3Bezier: D3BezierEdge };

const MindMapInner = ({ mapId, initialNodes }) => {
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
        openNotes: () => openNotes(rfNode),
        openLinks: () => openLinks(rfNode),
        openFiles: () => openFiles(rfNode),
        openAI: () => openAI(rfNode),
    }), [openNodeInput, handleDeleteNode, handleCopy, handlePaste, openNotes, openLinks, openFiles, openAI]);

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
        </div>
    );
};

const CanvasContainer = (props) => (
    <ReactFlowProvider>
        <MindMapInner {...props} />
    </ReactFlowProvider>
);

export default CanvasContainer;
