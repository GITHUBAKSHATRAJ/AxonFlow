import { api } from './client';

export const fetchMapNodes = (mapId) =>
    api.get(`/nodes/map/${mapId}`).then(r => r.data);

export const createNode = (mapId, nodeData) =>
    api.post(`/nodes/map/${mapId}`, nodeData).then(r => r.data);

export const updateNode = (nodeId, updateData) =>
    api.patch(`/nodes/${nodeId}`, updateData).then(r => r.data);

export const updateNodePosition = (nodeId, x, y) =>
    api.patch(`/nodes/${nodeId}/position`, { x, y }).then(r => r.data);

export const deleteNode = (nodeId) =>
    api.delete(`/nodes/${nodeId}`).then(r => r.data);

export const bulkUpdateNodes = (nodes) =>
    api.post('/nodes/bulk-update', nodes).then(r => r.data);
