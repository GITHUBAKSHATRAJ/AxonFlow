import { useCallback, useEffect } from 'react';

/**
 * useCanvasEvents hook
 * Handles user interactions like hovering, clicking, and keyboard shortcuts.
 */
export const useCanvasEvents = ({
    nodes,
    backendNodes,
    setEdges,
    setHoveredNodeId,
    setFocusedNodeId,
    setMenuConfig,
    openNodeInput,
    handleDeleteNode,
    handleNativePaste,
    EDGE_HOVER,
    EDGE_DEFAULT
}) => {

    const onHover = useCallback((nodeId) => {
        setHoveredNodeId(nodeId);
        
        // Walk ancestor chain and collect edge IDs on the path
        const pathIds = new Set();
        let cur = backendNodes.find(n => n.id === nodeId);
        while (cur && cur.parentId) {
            pathIds.add(`e-${cur.parentId}-${cur.id}`);
            cur = backendNodes.find(n => n.id === cur.parentId);
        }

        setEdges(prev => prev.map(e => ({
            ...e,
            style: {
                stroke: pathIds.has(e.id) ? EDGE_HOVER : (e.data?.originalStroke || EDGE_DEFAULT),
                strokeWidth: pathIds.has(e.id) ? 3 : 2,
                transition: 'stroke 0.18s ease, stroke-width 0.18s ease',
            },
        })));
    }, [backendNodes, setEdges, setHoveredNodeId, EDGE_HOVER, EDGE_DEFAULT]);

    const onHoverEnd = useCallback(() => {
        setHoveredNodeId(null);
        setEdges(prev => prev.map(e => ({
            ...e,
            style: {
                stroke: e.data?.originalStroke || EDGE_DEFAULT,
                strokeWidth: 2,
                transition: 'stroke 0.18s ease, stroke-width 0.18s ease',
            },
        })));
    }, [setEdges, setHoveredNodeId, EDGE_DEFAULT]);

    const onNodeClick = useCallback((_, n) => {
        setFocusedNodeId(n.id);
        setMenuConfig(null);
        if (n.data.hasChildren) {
            n.data.onToggle?.(n.id, n.data.isExpanded !== false ? false : true);
        }
    }, [setFocusedNodeId, setMenuConfig]);

    const onPaneClick = useCallback(() => {
        setMenuConfig(null);
        setFocusedNodeId(null);
    }, [setFocusedNodeId, setMenuConfig]);

    // Keyboard Shortcuts Logic
    useEffect(() => {
        const handler = (e) => {
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
            
            // We use a custom event or a ref to check if panels are open
            // For now, we assume if no input is focused, shortcuts are active
            
            const focusedId = document.querySelector('.react-flow__node.selected')?.getAttribute('data-id');
            if (!focusedId) return;

            // Find the node in the current React Flow state
            const rfNode = nodes.find(n => n.id === focusedId);
            if (!rfNode) return;

            if (e.key === 'Tab') {
                e.preventDefault();
                openNodeInput('child', rfNode);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                openNodeInput(rfNode.data.parentId ? 'sibling' : 'child', rfNode);
            } else if (e.key === 'F2') {
                e.preventDefault();
                openNodeInput('rename', rfNode);
            } else if (e.key === 'Delete') {
                e.preventDefault();
                handleDeleteNode(focusedId, rfNode.data.name);
            }
        };

        window.addEventListener('keydown', handler);
        window.addEventListener('paste', handleNativePaste);

        return () => {
            window.removeEventListener('keydown', handler);
            window.removeEventListener('paste', handleNativePaste);
        };
    }, [nodes, openNodeInput, handleDeleteNode, handleNativePaste]);

    return {
        onHover,
        onHoverEnd,
        onNodeClick,
        onPaneClick
    };
};
