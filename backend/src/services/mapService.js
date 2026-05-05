const Map = require('../models/Map');
const Node = require('../models/Node');

class MapService {
    /**
     * List all maps for a user with optional filters
     */
    async listMaps(userId, filters = {}) {
        const query = { userId };

        // Handle Favorite/Trashed filters
        if (filters.isFavorite === 'true') query.isFavorite = true;
        
        if (filters.isTrashed === 'true') {
            query.isTrashed = true;
        } else if (filters.isTrashed === 'false') {
            query.isTrashed = false;
        } else {
            query.isTrashed = { $ne: true }; // Default: hide trashed
        }

        // Handle Workspace/Folder filters
        if (filters.workspace) {
            query.workspace = filters.workspace;
            if (filters.folderId) {
                query.folderId = filters.folderId;
            } else {
                query.folderId = null;
            }
        } else if (filters.all !== 'true' && filters.isFavorite !== 'true') {
            // Standalone maps
            query.workspace = null;
        }

        return await Map.find(query).sort({ lastAccessedAt: -1 });
    }

    /**
     * Create a new Map and its Root Node
     */
    async createMap(userId, data) {
        // 1. Create the Map (Metadata)
        const newMap = new Map({
            name: data.name || 'New Map',
            userId,
            workspace: data.workspace || null,
            folderId: data.folderId || null
        });

        const savedMap = await newMap.save();

        // 2. Create the Root Node for this map
        const rootNode = new Node({
            mapId: savedMap._id,
            userId,
            parentId: null,
            name: savedMap.name,
            isExpanded: true
        });

        const savedRoot = await rootNode.save();

        // 3. Link the root node back to the Map
        savedMap.rootNodeId = savedRoot._id;
        await savedMap.save();

        return savedMap;
    }

    /**
     * Update map metadata (name, favorites, tags, etc.)
     */
    async updateMap(mapId, userId, updateData) {
        const map = await Map.findOne({ _id: mapId, userId });
        if (!map) throw new Error('Map not found');

        // Apply updates
        const fields = ['name', 'isFavorite', 'isTrashed', 'tags', 'workspace', 'folderId', 'lastAccessedAt'];
        fields.forEach(field => {
            if (updateData[field] !== undefined) map[field] = updateData[field];
        });

        // If name changed, also update the root node's name
        if (updateData.name && map.rootNodeId) {
            await Node.findByIdAndUpdate(map.rootNodeId, { name: updateData.name });
        }

        return await map.save();
    }

    /**
     * Duplicate a map and all its nodes recursively
     */
    async duplicateMap(oldMapId, userId) {
        // 1. Fetch original map and nodes
        const originalMap = await Map.findOne({ _id: oldMapId, userId });
        if (!originalMap) throw new Error('Original map not found');
        
        const originalNodes = await Node.find({ mapId: oldMapId, userId });

        // 2. Create New Map
        const newMap = new Map({
            ...originalMap.toObject(),
            _id: undefined,
            id: undefined,
            name: `${originalMap.name} (Copy)`,
            createdAt: undefined,
            updatedAt: undefined
        });
        const savedMap = await newMap.save();

        // 3. Find original root node
        const originalRoot = originalNodes.find(n => n.parentId === null);
        if (!originalRoot) throw new Error('Root node not found');

        // 4. Recursive Helper to copy nodes
        const copyNodesRecursive = async (oldParentId, newParentId) => {
            const children = originalNodes.filter(n => 
                n.parentId && n.parentId.toString() === oldParentId.toString()
            );

            for (const child of children) {
                const newNode = new Node({
                    ...child.toObject(),
                    _id: undefined,
                    id: undefined,
                    mapId: savedMap._id,
                    parentId: newParentId
                });
                const savedNode = await newNode.save();
                await copyNodesRecursive(child._id, savedNode._id);
            }
        };

        // 5. Create new root node and start recursion
        const newRoot = new Node({
            ...originalRoot.toObject(),
            _id: undefined,
            id: undefined,
            mapId: savedMap._id,
            parentId: null,
            name: `${originalRoot.name} (Copy)`
        });
        const savedRoot = await newRoot.save();
        
        // Link root back to map
        savedMap.rootNodeId = savedRoot._id;
        await savedMap.save();

        // Copy all children
        await copyNodesRecursive(originalRoot._id, savedRoot._id);

        return savedMap;
    }

    /**
     * Bulk update multiple maps
     */
    async bulkUpdateMaps(userId, mapIds, attributes) {
        return await Map.updateMany(
            { _id: { $in: mapIds }, userId },
            { $set: attributes }
        );
    }
}

module.exports = new MapService();
