const Node = require('../models/Node');

class NodeService {
    /**
     * Get all nodes for a specific map
     */
    async getNodesByMap(mapId, userId) {
        return await Node.find({ mapId, userId });
    }

    /**
     * Create a new node
     */
    async createNode(userId, nodeData) {
        const node = new Node({
            ...nodeData,
            userId
        });
        return await node.save();
    }

    /**
     * Update a specific node's fields (name, notes, links, etc.)
     */
    async updateNode(nodeId, userId, updateData) {
        // We find by both ID and userId to ensure ownership
        const node = await Node.findOneAndUpdate(
            { _id: nodeId, userId },
            { $set: updateData },
            { new: true }
        );
        if (!node) throw new Error('Node not found or unauthorized');
        return node;
    }

    /**
     * Specialized method for updating coordinates
     */
    async updatePosition(nodeId, userId, x, y) {
        return await this.updateNode(nodeId, userId, { x, y });
    }

    /**
     * Delete a node and all its descendants (Cascade Delete)
     */
    async deleteNodeRecursive(nodeId, userId) {
        const node = await Node.findOne({ _id: nodeId, userId });
        if (!node) return;

        // 1. Find all children
        const children = await Node.find({ parentId: nodeId, userId });

        // 2. Recursively delete children
        for (const child of children) {
            await this.deleteNodeRecursive(child._id, userId);
        }

        // 3. Delete the node itself
        await Node.deleteOne({ _id: nodeId, userId });
    }

    /**
     * Bulk update multiple nodes (e.g., after dragging or auto-layout)
     * Uses MongoDB bulkWrite for high performance
     */
    async bulkUpdateNodes(userId, nodesData) {
        if (!Array.isArray(nodesData)) throw new Error('Invalid nodes data');

        const operations = nodesData.map(node => {
            const { id, ...updateFields } = node;
            return {
                updateOne: {
                    filter: { _id: id, userId },
                    update: { $set: updateFields },
                    upsert: false
                }
            };
        });

        if (operations.length === 0) return null;

        return await Node.bulkWrite(operations);
    }

    /**
     * Toggle node expansion state
     */
    async toggleExpansion(nodeId, userId, isExpanded) {
        return await this.updateNode(nodeId, userId, { isExpanded });
    }
}

module.exports = new NodeService();
