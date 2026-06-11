//NOTE : Reviewed on 24th may, 2026
import { api } from './client';

/**
 * [NAMED FUNCTION] - Fetch all nodes associated with a specific map
 * Concept: Gets a list of elements/nodes representing mind map objects.
 */
export async function fetchMapNodes(mapId) {
    const response = await api.get(`/nodes/map/${mapId}`);
    return response.data;
}

/**
 * [NAMED FUNCTION] - Create a single node
 * Concept: Triggers a POST call supplying coordinate positions and naming details.
 */
export async function createNode(mapId, nodeData) {
    const response = await api.post(`/nodes/map/${mapId}`, nodeData);
    return response.data;
}

/**
 * [NAMED FUNCTION] - Update a node's details
 * Concept: Patches specific node metadata like label text.
 */
export async function updateNode(nodeId, updateData) {
    const response = await api.patch(`/nodes/${nodeId}`, updateData);
    return response.data;
}

/**
 * [NAMED FUNCTION] - Update a node's spatial coordinates
 * Concept: Patches x,y values dynamically as user drags objects on the canvas.
 */
export async function updateNodePosition(nodeId, x, y) {
    const response = await api.patch(`/nodes/${nodeId}/position`, { x, y });
    return response.data;
}

/**
 * [NAMED FUNCTION] - Delete a node
 * Concept: Deletes a node item based on its unique ID.
 */
export async function deleteNode(nodeId) {
    const response = await api.delete(`/nodes/${nodeId}`);
    return response.data;
}

/**
 * [NAMED FUNCTION] - Perform bulk updates on multiple nodes
 * Concept: POST call supplying array list of modifications to process in a single batch.
 */
export async function bulkUpdateNodes(nodes) {
    const response = await api.post('/nodes/bulk-update', nodes);
    return response.data;
}

/**
 * [NAMED FUNCTION] - Perform bulk creation of multiple nodes
 * Concept: POST call supplying array list of new nodes to insert at once.
 */
export async function bulkCreateNodes(nodes) {
    const response = await api.post('/nodes/bulk-create', nodes);
    return response.data;
}
