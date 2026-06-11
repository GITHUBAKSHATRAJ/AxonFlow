//NOTE : Reviewed on 24th may, 2026
import { api } from './client';

/**
 * [NAMED FUNCTION] - Fetch the list of all workspaces
 * Calls a GET endpoint and returns raw array data.
 */
export async function fetchWorkspaces() {
    const response = await api.get('/folders/workspaces/list');
    return response.data;
}

/**
 * [NAMED FUNCTION] - Rename a workspace
 * Sends a PATCH request containing original and new workspace names.
 */
export async function renameWorkspace(oldName, newName) {
    const response = await api.patch('/folders/workspaces/rename', { oldName, newName });
    return response.data;
}

/**
 * [NAMED FUNCTION] - Delete a workspace
 * Sends a DELETE request targeting a specific workspace route parameter.
 */
export async function deleteWorkspace(workspaceName) {
    const response = await api.delete(`/folders/workspaces/${encodeURIComponent(workspaceName)}`);
    return response.data;
}

/**
 * [NAMED FUNCTION] - Fetch folders within a workspace
 * Sends query parameters to filter results by workspace and parent folder ID.
 */
export async function fetchFolders(workspace, parentId = null) {
    const response = await api.get('/folders/list', { params: { workspace, parentId } });
    return response.data;
}

/**
 * [NAMED FUNCTION] - Create a folder
 * Sends folder configuration payload details in a POST request body.
 */
export async function createFolder(name, workspace, parentId = null) {
    const response = await api.post('/folders/create', { name, workspace, parentId });
    return response.data;
}

/**
 * [NAMED FUNCTION] - Delete a folder
 * Deletes a specific folder by passing its ID as a URL parameter.
 */
export async function deleteFolder(folderId) {
    const response = await api.delete(`/folders/${folderId}`);
    return response.data;
}
