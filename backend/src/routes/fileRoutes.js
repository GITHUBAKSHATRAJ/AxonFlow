const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const { upload } = require('../services/fileStorageService');

// All routes are prefixed with /api/files in index.js
router.post('/upload', upload.single('file'), fileController.uploadFile);
router.get('/:filename', fileController.getFile);

module.exports = router;
