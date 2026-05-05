const express = require('express');
const router = express.Router();
const mapController = require('../controllers/mapController');

// All routes are prefixed with /api/maps in index.js
router.get('/list', mapController.getMapList);
router.post('/create', mapController.createMap);
router.patch('/:mapId/attributes', mapController.updateMapAttributes);
router.post('/:mapId/duplicate', mapController.duplicateMap);
router.patch('/bulk-attributes', mapController.bulkUpdateMapAttributes);

module.exports = router;
