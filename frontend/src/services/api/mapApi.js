//NOTE : Reviewed on 24th may, 2026

import { api } from './client';

export const fetchAllMaps = (params = {}) => 
    api.get('/maps/list', { params }).then(r => r.data);

export const createMap = (name = 'New Idea Map', template = null, workspace = null, folderId = null) =>
    api.post('/maps/create', { name, template, workspace, folderId }).then(r => r.data);

export const updateMapAttributes = (mapId, attributes) =>
    api.patch(`/maps/${mapId}/attributes`, attributes).then(r => r.data);

export const duplicateMap = (mapId) =>
    api.post(`/maps/${mapId}/duplicate`).then(r => r.data);

export const bulkUpdateMapAttributes = (mapIds, attributes) =>
    api.patch('/maps/bulk-attributes', { mapIds, attributes }).then(r => r.data);
