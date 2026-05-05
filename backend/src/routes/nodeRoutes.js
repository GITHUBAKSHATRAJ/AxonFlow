const express = require('express');
const router = express.Router();
const nodeController = require('../controllers/nodeController');

// All routes are prefixed with /api/nodes in index.js
router.get('/map/:mapId', nodeController.getNodesByMap);
router.post('/map/:mapId', nodeController.createNode);
router.patch('/:id', nodeController.updateNode);
router.patch('/:id/position', nodeController.updateNodePosition);
router.delete('/:id', nodeController.deleteNode);
router.post('/bulk-update', nodeController.bulkUpdateNodes);

module.exports = router;
