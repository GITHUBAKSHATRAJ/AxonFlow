import { useCallback, useEffect } from 'react';

/**
 * [CUSTOM HOOK - useCanvasEvents]
 * Concept: Handles mouse interaction events (clicks, hovers) and triggers 
 * keyboard shortcut handlers (F2, Tab, Enter, Delete) inside the canvas viewport.
 */
export function useCanvasEvents({
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
}) {

    // [REACT HOOK: useCallback]
    // Memoizes hover listener function to prevent recalculating ancestral paths on every draw.
    const onHover = useCallback(function (nodeId) {
        setHoveredNodeId(nodeId);
        
        // Walk ancestor chain and collect edge IDs on the path to highlight connections
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

    // [REACT HOOK: useCallback]
    const onHoverEnd = useCallback(function () {
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

    // [REACT HOOK: useCallback]
    const onNodeClick = useCallback(function (_, n) {
        setFocusedNodeId(n.id);
        setMenuConfig(null);
        if (n.data.hasChildren) {
            n.data.onToggle?.(n.id, n.data.isExpanded !== false ? false : true);
        }
    }, [setFocusedNodeId, setMenuConfig]);

    // [REACT HOOK: useCallback]
    const onPaneClick = useCallback(function () {
        setMenuConfig(null);
        setFocusedNodeId(null);
    }, [setFocusedNodeId, setMenuConfig]);

    // [REACT HOOK: useEffect]
    // Hooks global window events to bind keyboard hotkeys when input boxes are inactive.
    useEffect(function () {
        const handler = (e) => {
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
            
            const focusedId = document.querySelector('.react-flow__node.selected')?.getAttribute('data-id');
            if (!focusedId) return;

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

        // Cleanup function removing keyboard listeners on component destruction
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
}
