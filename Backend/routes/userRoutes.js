import express from 'express'
import { loginUser, paymentRazorpay, registerUser, userCredits, verifyRazorpay, uploadProfileImage, updateUserProfile, getUserProfile, updatePassword, getCreditHistory, getSavedResults } from '../controllers/userController.js';
import auth from '../middlewares/auth.js';
import multer from 'multer';
import path from 'path';

const userRouter = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/profile-images/');
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
        }
    }
});

// Auth routes
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)

// Protected routes
userRouter.get('/credits', auth, userCredits)
userRouter.post('/pay-razor', auth, paymentRazorpay)
userRouter.post('/verify-razor', auth, verifyRazorpay)

// Profile routes
userRouter.get('/profile', auth, getUserProfile);
userRouter.put('/profile', auth, updateUserProfile);
userRouter.put('/update-password', auth, updatePassword);
userRouter.post('/profile/upload-image', auth, upload.single('profileImage'), uploadProfileImage);

// Credit and Results routes
userRouter.get('/credit-history', auth, getCreditHistory);
userRouter.get('/saved-results', auth, getSavedResults);

export default userRouter