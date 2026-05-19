const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '..', '..', 'FrontendSM', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB per file
});

// POST /api/upload — Upload a single image
router.post('/', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        // Robustness: If the production build folder (dist) exists, copy the uploaded file there too
        // so that direct Nginx static file serving from the dist directory works seamlessly.
        const distUploadDir = path.join(__dirname, '..', '..', 'FrontendSM', 'dist', 'uploads');
        try {
            const distDir = path.join(__dirname, '..', '..', 'FrontendSM', 'dist');
            if (fs.existsSync(distDir)) {
                if (!fs.existsSync(distUploadDir)) {
                    fs.mkdirSync(distUploadDir, { recursive: true });
                }
                fs.copyFileSync(req.file.path, path.join(distUploadDir, req.file.filename));
            }
        } catch (copyErr) {
            console.error('Failed to copy uploaded image to dist directory:', copyErr);
            // Non-blocking: don't fail the upload just because dist copy failed
        }

        // Return the relative path that can be served by the frontend
        const imagePath = `/uploads/${req.file.filename}`;
        res.json({
            success: true,
            imagePath: imagePath,
            filename: req.file.filename,
            message: 'Image uploaded successfully'
        });
    } catch (err) {
        res.status(500).json({ error: 'Upload failed: ' + err.message });
    }
});

module.exports = router;
