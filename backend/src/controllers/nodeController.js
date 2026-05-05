const nodeService = require('../services/nodeService');

/**
 * Get all nodes belonging to a specific map
 */
exports.getNodesByMap = async (req, res, next) => {
    try {
        if (!req.auth?.userId) return res.status(401).json({ error: 'Unauthorized' });
        
        const nodes = await nodeService.getNodesByMap(req.params.mapId, req.auth.userId);
        res.json(nodes);
    } catch (err) {
        next(err);
    }
};

/**
 * Create a new node (child idea)
 */
exports.createNode = async (req, res, next) => {
    try {
        if (!req.auth?.userId) return res.status(401).json({ error: 'Unauthorized' });
        
        // Ensure the node belongs to the mapId passed in URL
        const nodeData = { ...req.body, mapId: req.params.mapId };
        const newNode = await nodeService.createNode(req.auth.userId, nodeData);
        res.status(201).json(newNode);
    } catch (err) {
        next(err);
    }
};

/**
 * Update a specific node (name, notes, expansion, etc.)
 */
exports.updateNode = async (req, res, next) => {
    try {
        if (!req.auth?.userId) return res.status(401).json({ error: 'Unauthorized' });
        
        const updatedNode = await nodeService.updateNode(req.params.id, req.auth.userId, req.body);
        res.json(updatedNode);
    } catch (err) {
        next(err);
    }
};

/**
 * Move a node (update coordinates)
 */
exports.updateNodePosition = async (req, res, next) => {
    try {
        if (!req.auth?.userId) return res.status(401).json({ error: 'Unauthorized' });
        
        const { x, y } = req.body;
        const updatedNode = await nodeService.updatePosition(req.params.id, req.auth.userId, x, y);
        res.json(updatedNode);
    } catch (err) {
        next(err);
    }
};

/**
 * Delete a node and all its children (Recursive Delete)
 */
exports.deleteNode = async (req, res, next) => {
    try {
        if (!req.auth?.userId) return res.status(401).json({ error: 'Unauthorized' });
        
        await nodeService.deleteNodeRecursive(req.params.id, req.auth.userId);
        res.status(200).send();
    } catch (err) {
        next(err);
    }
};

/**
 * High-performance bulk update for multiple nodes
 */
exports.bulkUpdateNodes = async (req, res, next) => {
    try {
        if (!req.auth?.userId) return res.status(401).json({ error: 'Unauthorized' });
        
        const result = await nodeService.bulkUpdateNodes(req.auth.userId, req.body);
        res.json(result);
    } catch (err) {
        next(err);
    }
};
