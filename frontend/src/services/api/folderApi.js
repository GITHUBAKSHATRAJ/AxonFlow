import { api } from './client';

export const fetchWorkspaces = () =>
    api.get('/folders/workspaces/list').then(r => r.data);

export const renameWorkspace = (oldName, newName) =>
    api.patch('/folders/workspaces/rename', { oldName, newName }).then(r => r.data);

export const deleteWorkspace = (workspaceName) =>
    api.delete(`/folders/workspaces/${encodeURIComponent(workspaceName)}`).then(r => r.data);

export const fetchFolders = (workspace, parentId = null) =>
    api.get('/folders/list', { params: { workspace, parentId } }).then(r => r.data);

export const createFolder = (name, workspace, parentId = null) =>
    api.post('/folders/create', { name, workspace, parentId }).then(r => r.data);

export const deleteFolder = (folderId) =>
    api.delete(`/folders/${folderId}`).then(r => r.data);
