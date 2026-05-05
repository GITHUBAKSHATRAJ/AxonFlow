const express = require('express');
const router = express.Router();
const folderController = require('../controllers/folderController');

// All routes are prefixed with /api/folders in index.js
router.get('/workspaces/list', folderController.getWorkspaces);
router.patch('/workspaces/rename', folderController.renameWorkspace);
router.delete('/workspaces/:workspaceName', folderController.deleteWorkspace);

router.get('/list', folderController.getFolders);
router.post('/create', folderController.createFolder);
router.delete('/:id', folderController.deleteFolder);

module.exports = router;
