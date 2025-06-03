import userModel from "../models/userModel.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import validator from 'validator'
import razorpay from 'razorpay'
import transactionModel from "../models/transactionModel.js";
import fs from 'fs/promises';

const registerUser = async(req, res) => {
    try {
        const { name, email, password, username } = req.body;

        if (!name || !email || !password || !username) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // Validate username format
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return res.json({ success: false, message: "Username can only contain letters, numbers and underscores" })
        }

        if (username.length < 3 || username.length > 30) {
            return res.json({ success: false, message: "Username must be between 3 and 30 characters" })
        }

        // Check if username already exists
        const existingUsername = await userModel.findOne({ username });
        if (existingUsername) {
            return res.json({ success: false, message: "Username already taken" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            username,
            password: hashedPassword,
        })

        const user = await newUser.save()
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ success: true, token, user: { name: user.name, username: user.username } })

    } catch (error) {
        console.log(error)
        if (error.code === 11000) {
            // Handle duplicate key error
            if (error.keyPattern.email) {
                res.json({ success: false, message: "Email already registered" })
            } else if (error.keyPattern.username) {
                res.json({ success: false, message: "Username already taken" })
            }
        } else {
            res.json({ success: false, message: error.message })
        }
    }
}

const loginUser = async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User does not exist" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const userCredits = async(req, res) => {
    try {
        const userId = req.user;
        const user = await userModel.findById(userId)
        res.json({ success: true, credits: user.creditBalance, user: { name: user.name } })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const paymentRazorpay = async(req, res) => {
    try {
        const userId = req.user;
        const { planId } = req.body
        const userData = await userModel.findById(userId)

        if (!userData || !planId) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        let credits, plan, amount;

        switch (planId) {
            case 'Basic':
                plan = 'Basic'
                credits = 25
                amount = 10
                break;
            case 'Advanced':
                plan = 'Advanced'
                credits = 70
                amount = 30
                break;
            case 'Premier':
                plan = 'Premier'
                credits = 150
                amount = 50
                break;
            default:
                return res.json({ success: false, message: 'plan not found' });
        }

        const transactionData = {
            userId,
            plan,
            amount,
            credits,
            date: Date.now()
        }

        const newTransaction = await transactionModel.create(transactionData)

        const options = {
            amount: amount * 100,
            currency: process.env.CURRENCY,
            receipt: newTransaction._id,
        }

        await razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.json({ success: false, message: error })
            }
            res.json({ success: true, order })
        })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const verifyRazorpay = async(req, res) => {
    try {
        const { razorpay_order_id } = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if (orderInfo.status === 'paid') {
            const transactionData = await transactionModel.findById(orderInfo.receipt)
            if (transactionData.payment) {
                return res.json({ success: false, message: 'Payment already processed' })
            }

            if (transactionData.userId.toString() !== req.user.toString()) {
                return res.json({ success: false, message: 'Unauthorized transaction' })
            }

            const userData = await userModel.findById(transactionData.userId)
            const creditBalance = userData.creditBalance + transactionData.credits

            await userModel.findByIdAndUpdate(userData._id, { creditBalance })
            await transactionModel.findByIdAndUpdate(transactionData._id, { payment: true })
            res.json({ success: true, message: "Credits Added" })
        } else {
            res.json({ success: false, message: 'Payment Failed' })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const getUserProfile = async(req, res) => {
    try {
        if (!req.user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const profile = req.user.getPublicProfile();
        res.json({
            success: true,
            profile
        });
    } catch (error) {
        console.error('Error in getUserProfile:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching profile'
        });
    }
};

const updateUserProfile = async(req, res) => {
    try {
        if (!req.user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const { fullName, username, bio } = req.body;

        // Validate username if it's being updated
        if (username && username !== req.user.username) {
            if (!/^[a-zA-Z0-9_]+$/.test(username)) {
                return res.status(400).json({
                    success: false,
                    message: "Username can only contain letters, numbers and underscores"
                });
            }

            if (username.length < 3 || username.length > 30) {
                return res.status(400).json({
                    success: false,
                    message: "Username must be between 3 and 30 characters"
                });
            }

            // Check if username is already taken
            const existingUsername = await userModel.findOne({
                username,
                _id: { $ne: req.user._id }
            });

            if (existingUsername) {
                return res.status(400).json({
                    success: false,
                    message: "Username already taken"
                });
            }
        }

        const updates = {
            name: fullName,
            username: username || req.user.username, // Keep existing username if not provided
            bio: bio
        };

        Object.assign(req.user, updates);
        await req.user.save();

        res.json({
            success: true,
            profile: req.user.getPublicProfile()
        });
    } catch (error) {
        console.error('Update profile error:', error);
        if (error.code === 11000) {
            res.status(400).json({
                success: false,
                message: "Username already taken"
            });
        } else {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};

const uploadProfileImage = async(req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        if (!req.user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        try {
            const imageBuffer = await fs.readFile(req.file.path);
            const base64Image = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`;

            req.user.profileImage = {
                data: base64Image,
                contentType: req.file.mimetype
            };

            await req.user.save();
            await fs.unlink(req.file.path);

            res.json({
                success: true,
                profile: req.user.getPublicProfile(),
                message: 'Profile image updated successfully'
            });
        } catch (error) {
            try {
                await fs.unlink(req.file.path);
            } catch (deleteError) {
                console.error('Error deleting temporary file:', deleteError);
            }
            throw error;
        }
    } catch (error) {
        console.error('Upload image error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const updatePassword = async(req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user._id;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both current and new password'
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 8 characters long'
            });
        }

        // Get user with password
        const user = await userModel.findById(userId).select('+password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        user.password = hashedPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        console.error('Update password error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error updating password'
        });
    }
};

const getCreditHistory = async(req, res) => {
    try {
        const userId = req.user._id;

        // Get all transactions
        const transactions = await transactionModel.find({ userId })
            .sort({ date: -1 }) // Sort by date descending
            .select('plan amount credits date payment');

        // Get usage history from user model
        const user = await userModel.findById(userId);

        // Format transactions
        const formattedTransactions = [
            // Credit purchases
            ...transactions.map(transaction => ({
                date: transaction.date,
                type: 'Credit Purchase',
                amount: transaction.credits,
                description: `${transaction.plan} Plan Purchase`,
                status: transaction.payment ? 'completed' : 'pending'
            })),

            // Image generation history
            ...(user.imageHistory || []).map(history => ({
                date: history.date,
                type: 'Image Generation',
                amount: -1, // Deducted credits
                description: history.prompt || 'Image Generation',
                status: 'completed'
            })),

            // Voice generation history
            ...(user.voiceHistory || []).map(history => ({
                date: history.date,
                type: 'Voice Generation',
                amount: -1, // Deducted credits
                description: history.text || 'Voice Generation',
                status: 'completed'
            })),

            // Background removal history
            ...(user.bgRemovalHistory || []).map(history => ({
                date: history.date,
                type: 'Background Removal',
                amount: -1, // Deducted credits
                description: 'Background Removal',
                status: 'completed'
            }))
        ].sort((a, b) => b.date - a.date); // Sort all by date descending

        res.json({
            success: true,
            transactions: formattedTransactions
        });
    } catch (error) {
        console.error('Credit history error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching credit history'
        });
    }
};

const getSavedResults = async(req, res) => {
    try {
        const userId = req.user._id;
        // For now, return empty array as saved results feature is not implemented yet
        res.json({
            success: true,
            results: []
        });
    } catch (error) {
        console.error('Saved results error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching saved results'
        });
    }
};

export {
    registerUser,
    loginUser,
    userCredits,
    paymentRazorpay,
    verifyRazorpay,
    getUserProfile,
    updateUserProfile,
    uploadProfileImage,
    updatePassword,
    getCreditHistory,
    getSavedResults
}