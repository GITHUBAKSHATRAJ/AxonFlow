import { useState, useEffect, useCallback, useRef } from 'react';
import { useNodesState, useEdgesState } from '@xyflow/react';
import { buildReactFlowData, filterExpandedNodes } from '../../../utils/flowUtils';
import * as nodeApi from '../../../services/api/nodeApi';

/**
 * useCanvasState hook
 * Manages the synchronization between backend nodes and React Flow state.
 */
export const useCanvasState = (mapId, initialBackendNodes) => {
    const [backendNodes, setBackendNodes] = useState(initialBackendNodes || []);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    
    const [layoutMode, setLayoutMode] = useState('horizontal');
    const [colorPalette, setColorPalette] = useState('mono');

    // ── Update React Flow graph whenever backendNodes or visual settings change ──
    useEffect(() => {
        if (!backendNodes || backendNodes.length === 0) return;

        // 1. Filter only nodes that should be visible (parent is expanded)
        const visibleNodes = filterExpandedNodes(backendNodes);

        // 2. Run D3 layout and generate nodes/edges
        const { nodes: flowNodes, edges: flowEdges } = buildReactFlowData(
            visibleNodes, 
            layoutMode, 
            colorPalette
        );

        // 3. Enrich nodes with runtime callbacks
        const enriched = flowNodes.map(node => ({
            ...node,
            data: {
                ...node.data,
                id: node.id,
                hasChildren: backendNodes.some(n => n.parentId === node.id),
                // Callback for expanding/collapsing a branch
                onToggle: async (id, isExpanded) => {
                    setBackendNodes(prev => prev.map(n => n.id === id ? { ...n, isExpanded } : n));
                    try {
                        await nodeApi.updateNode(id, { isExpanded });
                    } catch (err) {
                        console.error('Failed to toggle node:', err);
                    }
                },
                // Callbacks for inline editing (drafts)
                onDraftConfirm: async (id, newName, mode, targetId) => {
                    const name = newName.trim();
                    if (!name) {
                        if (mode === 'rename') {
                            setBackendNodes(prev => prev.map(n => n.id === id ? { ...n, _isEditing: false } : n));
                        } else {
                            setBackendNodes(prev => prev.filter(n => n.id !== id));
                        }
                        return;
                    }

                    try {
                        if (mode === 'rename') {
                            setBackendNodes(prev => prev.map(n => n.id === id ? { ...n, name, _isEditing: false } : n));
                            await nodeApi.updateNode(id, { name });
                        } else {
                            const newNode = await nodeApi.createNode(mapId, { name, parentId: targetId, isExpanded: true });
                            setBackendNodes(prev => prev.map(n => n.id === id ? newNode : n));
                        }
                    } catch (err) {
                        console.error('Draft confirm failed:', err);
                    }
                },
                onDraftCancel: (id, mode) => {
                    if (mode === 'rename') {
                        setBackendNodes(prev => prev.map(n => n.id === id ? { ...n, _isEditing: false } : n));
                    } else {
                        setBackendNodes(prev => prev.filter(n => n.id !== id));
                    }
                }
            }
        }));

        setNodes(enriched);
        setEdges(flowEdges);
    }, [backendNodes, layoutMode, colorPalette, mapId, setNodes, setEdges]);

    return {
        backendNodes,
        setBackendNodes,
        nodes,
        setNodes,
        onNodesChange,
        edges,
        setEdges,
        onEdgesChange,
        layoutMode,
        setLayoutMode,
        colorPalette,
        setColorPalette
    };
};
