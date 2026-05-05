import { useCallback, useRef } from 'react';
import * as nodeApi from '../../../services/api/nodeApi';
import { parseIndentedText } from '../../../utils/flowUtils';

let clipboard = null;

/**
 * useCanvasActions hook
 * Handles complex business actions like recursive deletion, branch cloning, and panel management.
 */
export const useCanvasActions = ({
    mapId,
    setBackendNodes,
    backendNodesRef,
    setSelectedNode,
    setMenuConfig,
    setNotesOpen,
    setLinksOpen,
    setFilesOpen,
    setAiOpen
}) => {

    // ── Helper: Open Input for New Node or Rename ──
    const openNodeInput = useCallback((mode, rfNode) => {
        setMenuConfig(null);
        const draftId = `draft-${Date.now()}`;

        if (mode === 'rename') {
            setBackendNodes(prev => prev.map(n => n.id === rfNode.id ? { ...n, _isEditing: true } : n));
        } else if (mode === 'child') {
            setBackendNodes(prev => {
                const expanded = prev.map(n => n.id === rfNode.id ? { ...n, isExpanded: true } : n);
                return [...expanded, {
                    id: draftId,
                    parentId: rfNode.id,
                    name: '',
                    _isDraft: true,
                    _draftMode: 'child',
                    _targetId: rfNode.id
                }];
            });
            nodeApi.updateNode(rfNode.id, { isExpanded: true }).catch(console.error);
        } else if (mode === 'sibling') {
            if (!rfNode.data.parentId) return;
            setBackendNodes(prev => [...prev, {
                id: draftId,
                parentId: rfNode.data.parentId,
                name: '',
                _isDraft: true,
                _draftMode: 'sibling',
                _targetId: rfNode.data.parentId
            }]);
        }
    }, [setBackendNodes, setMenuConfig]);

    // ── Helper: Delete Node and Subtree ──
    const handleDeleteNode = useCallback(async (id, name) => {
        if (!window.confirm(`Delete "${name}" and all its children?`)) return;
        try {
            await nodeApi.deleteNode(id);
            const all = backendNodesRef.current;
            const toDelete = new Set();
            const collect = (nid) => {
                toDelete.add(nid);
                all.filter(n => n.parentId === nid).forEach(c => collect(c.id));
            };
            collect(id);
            setBackendNodes(prev => prev.filter(n => !toDelete.has(n.id)));
        } catch (err) {
            console.error('Delete failed:', err);
        }
    }, [setBackendNodes, backendNodesRef]);

    // ── Clipboard Actions ──
    const handleCopy = useCallback((rfNode) => {
        setMenuConfig(null);
        const all = backendNodesRef.current;
        const branch = [];
        const collect = (nid) => {
            const n = all.find(x => x.id === nid);
            if (n) {
                branch.push(n);
                all.filter(x => x.parentId === nid).forEach(c => collect(c.id));
            }
        };
        collect(rfNode.id);
        clipboard = { rootId: rfNode.id, nodes: branch };
    }, [backendNodesRef, setMenuConfig]);

    const handlePaste = useCallback(async (targetNodeId) => {
        setMenuConfig(null);
        let externalText = null;
        try {
            externalText = await navigator.clipboard.readText();
        } catch (err) {
            console.log('Clipboard read blocked:', err);
        }

        if (!clipboard && !externalText) {
            alert('Clipboard is empty.');
            return;
        }

        if (clipboard) {
            // Clone branch with new IDs
            const idMap = {};
            const generateObjectId = () => [...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
            const cloned = clipboard.nodes.map(n => {
                const newId = generateObjectId();
                idMap[n.id] = newId;
                return { ...n, id: newId };
            });
            const patched = cloned.map(n => ({
                ...n,
                parentId: n.id === idMap[clipboard.rootId] ? targetNodeId : idMap[n.parentId] || n.parentId,
            }));

            try {
                await nodeApi.bulkUpdateNodes(patched); // Using bulk-update for insertion
                setBackendNodes(prev => [
                    ...prev.map(n => n.id === targetNodeId ? { ...n, isExpanded: true } : n),
                    ...patched,
                ]);
                await nodeApi.updateNode(targetNodeId, { isExpanded: true });
            } catch (err) {
                console.error('Paste failed:', err);
            }
        } else if (externalText) {
            const newNodes = parseIndentedText(externalText, targetNodeId);
            if (!newNodes.length) return;
            try {
                const inserted = await nodeApi.bulkUpdateNodes(newNodes);
                setBackendNodes(prev => [
                    ...prev.map(n => n.id === targetNodeId ? { ...n, isExpanded: true } : n),
                    ...(Array.isArray(inserted) ? inserted : []),
                ]);
                await nodeApi.updateNode(targetNodeId, { isExpanded: true });
            } catch (err) {
                console.error('Text paste failed:', err);
            }
        }
    }, [setBackendNodes, setMenuConfig]);

    // ── Panel Actions ──
    const openNotes = useCallback((node) => { setMenuConfig(null); setSelectedNode(node); setNotesOpen(true); }, [setMenuConfig, setSelectedNode, setNotesOpen]);
    const openLinks = useCallback((node) => { setMenuConfig(null); setSelectedNode(node); setLinksOpen(true); }, [setMenuConfig, setSelectedNode, setLinksOpen]);
    const openFiles = useCallback((node) => { setMenuConfig(null); setSelectedNode(node); setFilesOpen(true); }, [setMenuConfig, setSelectedNode, setFilesOpen]);
    const openAI = useCallback((node) => { setMenuConfig(null); setSelectedNode(node); setAiOpen(true); }, [setMenuConfig, setSelectedNode, setAiOpen]);

    return {
        openNodeInput,
        handleDeleteNode,
        handleCopy,
        handlePaste,
        openNotes,
        openLinks,
        openFiles,
        openAI
    };
};
