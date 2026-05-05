const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Use environment variable with a fallback to project root 'uploads'
const uploadDir = process.env.UPLOAD_PATH 
    ? path.resolve(process.env.UPLOAD_PATH) 
    : path.join(process.cwd(), 'uploads');

// Ensure directory exists
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage });

module.exports = { upload, uploadDir };
