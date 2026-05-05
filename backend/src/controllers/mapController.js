const mapService = require('../services/mapService');

/**
 * Get all maps for the authenticated user
 */
exports.getMapList = async (req, res, next) => {
    try {
        if (!req.auth?.userId) return res.status(401).json({ error: 'Unauthorized' });
        
        const maps = await mapService.listMaps(req.auth.userId, req.query);
        res.json(maps);
    } catch (err) {
        next(err);
    }
};

/**
 * Create a new map and its root node
 */
exports.createMap = async (req, res, next) => {
    try {
        if (!req.auth?.userId) return res.status(401).json({ error: 'Unauthorized' });
        
        const newMap = await mapService.createMap(req.auth.userId, req.body);
        res.status(201).json(newMap);
    } catch (err) {
        next(err);
    }
};

/**
 * Update map attributes (isFavorite, isTrashed, tags, etc.)
 */
exports.updateMapAttributes = async (req, res, next) => {
    try {
        if (!req.auth?.userId) return res.status(401).json({ error: 'Unauthorized' });
        
        const updatedMap = await mapService.updateMap(req.params.mapId, req.auth.userId, req.body);
        res.json(updatedMap);
    } catch (err) {
        next(err);
    }
};

/**
 * Duplicate an entire map and its node tree
 */
exports.duplicateMap = async (req, res, next) => {
    try {
        if (!req.auth?.userId) return res.status(401).json({ error: 'Unauthorized' });
        
        const duplicatedMap = await mapService.duplicateMap(req.params.mapId, req.auth.userId);
        res.status(201).json(duplicatedMap);
    } catch (err) {
        next(err);
    }
};

/**
 * Bulk update multiple maps (e.g., trashing multiple maps)
 */
exports.bulkUpdateMapAttributes = async (req, res, next) => {
    try {
        if (!req.auth?.userId) return res.status(401).json({ error: 'Unauthorized' });
        
        await mapService.bulkUpdateMaps(req.auth.userId, req.body.mapIds, req.body.attributes);
        res.status(200).send();
    } catch (err) {
        next(err);
    }
};
