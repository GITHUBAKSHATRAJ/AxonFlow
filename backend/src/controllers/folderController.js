const folderService = require('../services/folderService');

/**
 * Get list of all workspaces
 */
exports.getWorkspaces = async (req, res, next) => {
    try {
        if (!req.auth?.userId) return res.status(401).json({ error: 'Unauthorized' });
        
        const workspaces = await folderService.getWorkspaces(req.auth.userId);
        res.json(workspaces);
    } catch (err) {
        next(err);
    }
};

/**
 * Rename a workspace
 */
exports.renameWorkspace = async (req, res, next) => {
    try {
        if (!req.auth?.userId) return res.status(401).json({ error: 'Unauthorized' });
        
        const { oldName, newName } = req.body;
        await folderService.renameWorkspace(req.auth.userId, oldName, newName);
        res.status(200).send();
    } catch (err) {
        next(err);
    }
};

/**
 * Delete a workspace
 */
exports.deleteWorkspace = async (req, res, next) => {
    try {
        if (!req.auth?.userId) return res.status(401).json({ error: 'Unauthorized' });
        
        await folderService.deleteWorkspace(req.auth.userId, req.params.workspaceName);
        res.status(200).send();
    } catch (err) {
        next(err);
    }
};

/**
 * Get list of folders (supports filtering by workspace and parentId)
 */
exports.getFolders = async (req, res, next) => {
    try {
        if (!req.auth?.userId) return res.status(401).json({ error: 'Unauthorized' });
        
        const { workspace, parentId } = req.query;
        const folders = await folderService.getFolders(req.auth.userId, workspace, parentId);
        res.json(folders);
    } catch (err) {
        next(err);
    }
};

/**
 * Create a new folder
 */
exports.createFolder = async (req, res, next) => {
    try {
        if (!req.auth?.userId) return res.status(401).json({ error: 'Unauthorized' });
        
        const newFolder = await folderService.createFolder(req.auth.userId, req.body);
        res.status(201).json(newFolder);
    } catch (err) {
        next(err);
    }
};

/**
 * Delete a folder recursively
 */
exports.deleteFolder = async (req, res, next) => {
    try {
        if (!req.auth?.userId) return res.status(401).json({ error: 'Unauthorized' });
        
        await folderService.deleteFolderRecursive(req.auth.userId, req.params.id);
        res.status(200).send();
    } catch (err) {
        next(err);
    }
};
