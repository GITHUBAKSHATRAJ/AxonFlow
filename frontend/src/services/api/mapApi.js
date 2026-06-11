//NOTE : Reviewed on 24th may, 2026
import { api } from './client';

/**
 * [NAMED FUNCTION] - Fetch all maps matching custom criteria
 * Concept: Passes filter parameters (like isTrashed, isFavorite) to customize list query results.
 */
export async function fetchAllMaps(params = {}) {
    const response = await api.get('/maps/list', { params });
    return response.data;
}

/**
 * [NAMED FUNCTION] - Create a new mind map
 * Concept: Triggers a POST call supplying naming, template options, and path destinations.
 */
export async function createMap(name = 'New Idea Map', template = null, workspace = null, folderId = null) {
    const response = await api.post('/maps/create', { name, template, workspace, folderId });
    return response.data;
}

/**
 * [NAMED FUNCTION] - Update metadata attributes of a map
 * Concept: Patches specific map parameters (like renaming, pin flags, trashing items).
 */
export async function updateMapAttributes(mapId, attributes) {
    const response = await api.patch(`/maps/${mapId}/attributes`, attributes);
    return response.data;
}

/**
 * [NAMED FUNCTION] - Duplicate/clone an existing map
 * Concept: Runs a POST request calling backend copying methods.
 */
export async function duplicateMap(mapId) {
    const response = await api.post(`/maps/${mapId}/duplicate`);
    return response.data;
}

/**
 * [NAMED FUNCTION] - Bulk update attributes across multiple maps
 * Concept: Runs a PATCH request targeting multiple map IDs at once.
 */
export async function bulkUpdateMapAttributes(mapIds, attributes) {
    const response = await api.patch('/maps/bulk-attributes', { mapIds, attributes });
    return response.data;
}
