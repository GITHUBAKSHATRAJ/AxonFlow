const path = require('path');
const fs = require('fs');
const { uploadDir } = require('../services/fileStorageService');

/**
 * Handle file upload response
 */
exports.uploadFile = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // We construct the URL dynamically based on the current host
        const protocol = req.protocol;
        const host = req.get('host');

        const response = {
            fileName: req.file.originalname,
            // In AxonFlow, we use a clean /api/files route
            fileUrl: `${protocol}://${host}/api/files/${req.file.filename}`
        };

        res.json(response);
    } catch (err) {
        next(err);
    }
};

/**
 * Download/Serve a file
 */
exports.getFile = (req, res, next) => {
    try {
        const filePath = path.join(uploadDir, req.params.filename);

        if (fs.existsSync(filePath)) {
            res.download(filePath);
        } else {
            res.status(404).json({ error: 'File not found' });
        }
    } catch (err) {
        next(err);
    }
};
