const Folder = require('../models/Folder');
const Map = require('../models/Map');

class FolderService {
    /**
     * Get unique workspace names for a user
     */
    async getWorkspaces(userId) {
        const mapWorkspaces = await Map.distinct('workspace', { userId, isTrashed: { $ne: true } });
        const folderWorkspaces = await Folder.distinct('workspace', { userId });
        
        const combined = Array.from(new Set([...mapWorkspaces, ...folderWorkspaces]));
        return combined.filter(w => w && typeof w === 'string' && w.trim() !== '');
    }

    /**
     * Rename a workspace across all folders and maps
     */
    async renameWorkspace(userId, oldName, newName) {
        await Map.updateMany({ userId, workspace: oldName }, { $set: { workspace: newName } });
        await Folder.updateMany({ userId, workspace: oldName }, { $set: { workspace: newName } });
    }

    /**
     * Delete an entire workspace (DANGER: Deletes all maps and folders)
     */
    async deleteWorkspace(userId, workspaceName) {
        // Note: In a production app, we might want to soft-delete these instead
        await Folder.deleteMany({ userId, workspace: workspaceName });
        await Map.deleteMany({ userId, workspace: workspaceName });
    }

    /**
     * List folders in a workspace or sub-folder
     */
    async getFolders(userId, workspace, parentId = null) {
        const query = { userId };
        if (workspace) query.workspace = workspace;
        query.parentId = parentId;
        
        return await Folder.find(query);
    }

    /**
     * Create a new folder
     */
    async createFolder(userId, data) {
        const folder = new Folder({
            name: data.name,
            workspace: data.workspace,
            parentId: data.parentId || null,
            userId
        });
        return await folder.save();
    }

    /**
     * Delete a folder and all its subfolders (Recursive)
     * Also trashes maps inside those folders
     */
    async deleteFolderRecursive(userId, folderId) {
        // 1. Find subfolders
        const subfolders = await Folder.find({ parentId: folderId, userId });
        
        // 2. Recursively delete subfolders
        for (const sub of subfolders) {
            await this.deleteFolderRecursive(userId, sub._id);
        }

        // 3. Trash all maps in this folder
        await Map.updateMany(
            { folderId, userId },
            { $set: { isTrashed: true } }
        );

        // 4. Delete the folder itself
        await Folder.deleteOne({ _id: folderId, userId });
    }
}

module.exports = new FolderService();
