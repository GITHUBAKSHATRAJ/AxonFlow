const express = require('express');
const router = express.Router();

const mapRoutes = require('./mapRoutes');
const nodeRoutes = require('./nodeRoutes');
const folderRoutes = require('./folderRoutes');
const fileRoutes = require('./fileRoutes');

// Combine all route modules
router.use('/maps', mapRoutes);
router.use('/nodes', nodeRoutes);
router.use('/folders', folderRoutes);
router.use('/files', fileRoutes);

module.exports = router;
