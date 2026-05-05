import { useCallback, useRef, useState } from 'react';
import * as nodeApi from '../../../services/api/nodeApi';

/**
 * Returns true if `candidateId` is in the subtree rooted at `nodeId`
 */
function isDescendantOf(candidateId, nodeId, nodes) {
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    let cur = nodeMap.get(candidateId);
    while (cur) {
        if (cur.parentId === nodeId) return true;
        cur = nodeMap.get(cur.parentId);
    }
    return false;
}

/**
 * useDragReparent hook
 * Handles the "Drag-to-Reparent" logic for the React Flow mind-map.
 */
export const useDragReparent = ({ mapId, backendNodes, setBackendNodes, rfNodes }) => {
    const [dropTargetId, setDropTargetId] = useState(null);

    const backendRef = useRef(backendNodes);
    const rfRef = useRef(rfNodes);
    backendRef.current = backendNodes;
    rfRef.current = rfNodes;

    // ── During drag: find and highlight the drop target ──
    const onNodeDrag = useCallback((_, draggedNode) => {
        // Root node is not draggable for reparenting
        if (!draggedNode.data?.parentId) {
            setDropTargetId(null);
            return;
        }

        const { x: nx, y: ny } = draggedNode.position;
        const dW = draggedNode.measured?.width || draggedNode.width || 160;
        const dH = draggedNode.measured?.height || draggedNode.height || 28;

        // Use the CENTER of the dragged node as the cursor point
        const cursorX = nx + dW / 2;
        const cursorY = ny + dH / 2;

        let found = null;
        for (const n of rfRef.current) {
            if (n.id === draggedNode.id) continue;

            const tW = n.measured?.width || n.width || 160;
            const tH = n.measured?.height || n.height || 28;
            const tx = n.position.x;
            const ty = n.position.y;

            // Hit zone: the target node's bounding box + small padding
            const PAD = 24;
            const hit =
                cursorX >= tx - PAD && cursorX <= tx + tW + PAD &&
                cursorY >= ty - PAD && cursorY <= ty + tH + PAD;

            if (!hit) continue;

            // Cycle prevention: drop onto descendant
            if (isDescendantOf(n.id, draggedNode.id, backendRef.current)) continue;

            // No-op: drop onto current parent
            if (n.id === draggedNode.data.parentId) continue;

            found = n.id;
            break;
        }

        setDropTargetId(found);
    }, []);

    // ── Drop: reparent the branch or just save new position ──
    const onNodeDragStop = useCallback(async (_, draggedNode) => {
        const target = dropTargetId;
        setDropTargetId(null);

        if (!draggedNode.data?.parentId) return;

        if (!target) {
            // No drop target -> save position
            try {
                await nodeApi.updateNodePosition(
                    draggedNode.id,
                    draggedNode.position.x,
                    draggedNode.position.y
                );
            } catch (err) {
                console.error('Failed to save node position:', err);
            }
            return;
        }

        // ── Reparent the branch ──
        try {
            // 1. Optimistic UI update
            setBackendNodes(prev => prev.map(n => {
                if (n.id === draggedNode.id) return { ...n, parentId: target };
                if (n.id === target) return { ...n, isExpanded: true };
                return n;
            }));

            // 2. Persist to API
            await nodeApi.updateNode(draggedNode.id, { parentId: target });
            await nodeApi.updateNode(target, { isExpanded: true });

        } catch (err) {
            console.error('Reparent failed, reverting...', err);
            // Revert by fetching fresh data
            try {
                const fresh = await nodeApi.fetchMapNodes(mapId);
                setBackendNodes(fresh);
            } catch (e) {
                console.error('Reversion reload failed:', e);
            }
        }
    }, [dropTargetId, mapId, setBackendNodes]);

    return { dropTargetId, onNodeDrag, onNodeDragStop };
};
