import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import userModel from '../models/userModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

export const removeBackground = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image file provided' });
        }

        const userId = req.user;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.creditBalance <= 0) {
            return res.status(400).json({
                success: false,
                message: 'No credit balance',
                creditBalance: user.creditBalance
            });
        }

        const imagePath = req.file.path;
        const imageBuffer = fs.readFileSync(imagePath);

        // Call Remove.bg API
        const response = await axios({
            method: 'post',
            url: 'https://api.remove.bg/v1.0/removebg',
            headers: {
                'X-Api-Key': process.env.REMOVE_BG_API_KEY,
                'Content-Type': 'application/json',
            },
            data: {
                image_file_b64: imageBuffer.toString('base64'),
                size: 'auto',
                format: 'auto',
            },
            responseType: 'arraybuffer'
        });

        // Save the processed image
        const outputPath = path.join(uploadsDir, `processed-${Date.now()}.png`);
        fs.writeFileSync(outputPath, response.data);

        // Convert to base64 for sending to frontend
        const processedImageBuffer = fs.readFileSync(outputPath);
        const base64Image = processedImageBuffer.toString('base64');

        // Clean up files
        try {
            fs.unlinkSync(imagePath);
            fs.unlinkSync(outputPath);
        } catch (cleanupError) {
            console.error('Error cleaning up files:', cleanupError);
            // Continue execution even if cleanup fails
        }

        // Deduct credit
        await userModel.findByIdAndUpdate(user._id, {
            creditBalance: user.creditBalance - 1
        });

        res.json({
            success: true,
            message: 'Background removed successfully',
            creditBalance: user.creditBalance - 1,
            processedImage: `data:image/png;base64,${base64Image}`
        });

    } catch (error) {
        console.error('Remove.bg API Error:', error.response?.data || error.message);
        
        // Clean up any uploaded file if it exists
        if (req.file && req.file.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (cleanupError) {
                console.error('Error cleaning up uploaded file:', cleanupError);
            }
        }

        res.status(500).json({
            success: false,
            message: 'Failed to remove background',
            error: error.response?.data || error.message
        });
    }
}; 