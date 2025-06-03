import express from 'express'
import {generateImage} from '../controllers/imageController.js'
import authUser from '../middlewares/auth.js'
import multer from 'multer'
import { removeBackground } from '../controllers/removeBgController.js'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imageRouter = express.Router()

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir)
    },
    filename: function (req, file, cb) {
        // Get file extension
        const ext = path.extname(file.originalname);
        // Create filename with timestamp and original extension
        cb(null, `${Date.now()}-${Math.random().toString(36).substring(7)}${ext}`)
    }
})

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true)
        } else {
            cb(new Error('Not an image! Please upload an image.'), false)
        }
    }
})

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File size too large. Maximum size is 5MB.'
            });
        }
        return res.status(400).json({
            success: false,
            message: err.message
        });
    } else if (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    next();
};

imageRouter.post('/generate-image', authUser, generateImage)

// Route for removing background with error handling
imageRouter.post('/remove-background', 
    authUser,
    upload.single('image'),
    handleMulterError,
    removeBackground
)

export default imageRouter