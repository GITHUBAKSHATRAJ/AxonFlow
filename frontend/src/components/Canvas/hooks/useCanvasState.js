import { useState, useEffect } from 'react';
import { useNodesState, useEdgesState } from '@xyflow/react';
import { buildReactFlowData, filterExpandedNodes } from '../../../utils/flowUtils';
import * as nodeApi from '../../../services/api/nodeApi';

/**
 * [CUSTOM HOOK - useCanvasState]
 * Concept: Encapsulates state variable synchronization between backend nodes data 
 * and front-end React Flow graph visualization states (nodes, edges).
 */
export function useCanvasState(mapId, initialBackendNodes) {
    const [backendNodes, setBackendNodes] = useState(initialBackendNodes || []);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    
    const [layoutMode, setLayoutMode] = useState('horizontal');
    const [colorPalette, setColorPalette] = useState('mono');

    // [REACT HOOK: useEffect]
    // Re-calculates and re-aligns D3 layout tree maps whenever nodes array or layouts settings change.
    useEffect(function () {
        if (!backendNodes || backendNodes.length === 0) return;

        // 1. Filter out collapsed sub-branches
        const visibleNodes = filterExpandedNodes(backendNodes);

        // 2. Build D3 tree mapping coordinates
        const { nodes: flowNodes, edges: flowEdges } = buildReactFlowData(
            visibleNodes, 
            layoutMode, 
            colorPalette
        );

        // 3. Attach interactive callbacks to node properties
        const enriched = flowNodes.map(node => ({
            ...node,
            data: {
                ...node.data,
                id: node.id,
                hasChildren: backendNodes.some(n => n.parentId === node.id),
                // Expand / Collapse branch handler callback
                onToggle: async (id, isExpanded) => {
                    setBackendNodes(prev => prev.map(n => n.id === id ? { ...n, isExpanded } : n));
                    try {
                        await nodeApi.updateNode(id, { isExpanded });
                    } catch (err) {
                        console.error('Failed to toggle node:', err);
                    }
                },
                // Confirm node rename details
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
                // Discard changes to node name
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
}
