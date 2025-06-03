import axios from "axios";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

const MAX_RETRIES = 2;
const TIMEOUT = 60000; // 60 seconds

async function callHuggingFaceAPI(text, retryCount = 0) {
    try {
        const response = await axios.post(
            "https://router.huggingface.co/fal-ai/fal-ai/dia-tts", {
                text: text.trim()
            }, {
                headers: {
                    "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    "Content-Type": "application/json",
                },
                timeout: TIMEOUT
            }
        );
        return response;
    } catch (error) {
        if (error.response && error.response.data && 
            (error.response.data.error?.includes("exceeded your monthly included credits") || 
             error.response.data.error?.includes("Inference API rate limit"))) {
            throw new Error("Hugging Face API credit limit reached. Please try again later or contact support.");
        }

        if (retryCount < MAX_RETRIES && (error.code === 'ECONNABORTED' || (error.response && error.response.status === 504))) {
            console.log(`Retrying API call (attempt ${retryCount + 1})...`);
            // Wait for 2 seconds before retrying
            await new Promise(resolve => setTimeout(resolve, 2000));
            return callHuggingFaceAPI(text, retryCount + 1);
        }
        throw error;
    }
}

async function fetchAudioFromUrl(url) {
    try {
        const response = await axios.get(url, {
            responseType: 'arraybuffer'
        });
        return Buffer.from(response.data).toString('base64');
    } catch (error) {
        console.error("Error fetching audio from URL:", error);
        throw new Error("Failed to fetch audio data");
    }
}

export const textToSpeech = async(req, res) => {
    try {
        const { text, style } = req.body;
        const token = req.headers.token;

        console.log("=== Text-to-Speech Request ===");
        console.log("Token received:", token ? "Yes" : "No");
        console.log("Request body:", { text, style });

        if (!token) {
            return res.status(401).json({
                error: "Authentication required",
                details: "No token provided"
            });
        }

        // Verify token and get user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        console.log("Decoded user ID:", userId);

        if (!text || typeof text !== 'string') {
            return res.status(400).json({
                error: "Invalid input",
                details: "'text' is required and must be a string"
            });
        }

        // Validate text length
        const trimmedText = text.trim();
        if (trimmedText.length === 0) {
            return res.status(400).json({
                error: "Invalid input",
                details: "Text cannot be empty"
            });
        }

        if (trimmedText.length > 500) {
            return res.status(400).json({
                error: "Text too long",
                details: "Maximum 500 characters allowed"
            });
        }

        // Check user's credit balance
        const user = await userModel.findById(userId);
        console.log("Found user:", user ? "Yes" : "No");
        console.log("User credit balance:", user ? user.creditBalance : "Not found");

        if (!user) {
            return res.status(401).json({
                error: "User not found",
                details: "Please login again"
            });
        }

        if (user.creditBalance <= 0) {
            return res.status(402).json({
                error: "Insufficient credits",
                creditBalance: user.creditBalance
            });
        }

        console.log("Calling Hugging Face API...");
        const response = await callHuggingFaceAPI(trimmedText);

        console.log("Hugging Face API response received");
        console.log("Response status:", response.status);
        console.log("Response data:", JSON.stringify(response.data));

        if (!response.data || !response.data.audio || !response.data.audio.url) {
            throw new Error("Invalid response format from the API");
        }

        // Fetch the audio data from the URL
        console.log("Fetching audio from URL:", response.data.audio.url);
        const audioBase64 = await fetchAudioFromUrl(response.data.audio.url);
        const audioUrl = `data:audio/wav;base64,${audioBase64}`;

        // Deduct credit after successful generation
        const updatedUser = await userModel.findByIdAndUpdate(
            userId, {
                $inc: { creditBalance: -1 },
                $push: {
                    voiceHistory: {
                        text: trimmedText,
                        credits: 1,
                        timestamp: new Date()
                    }
                }
            }, { new: true }
        );

        console.log("Updated credit balance:", updatedUser.creditBalance);
        console.log("=== Text-to-Speech Request Completed ===");

        res.json({
            audioUrl,
            creditBalance: updatedUser.creditBalance
        });
    } catch (error) {
        console.error("=== Text-to-Speech Error ===");
        console.error("Error type:", error.name);
        console.error("Error message:", error.message);

        if (error.response) {
            console.error("Error response data:", error.response.data);
            console.error("Error response status:", error.response.status);
        }

        if (error.message.includes("Hugging Face API credit limit reached")) {
            return res.status(429).json({
                error: "Service temporarily unavailable",
                details: "The text-to-speech service has reached its usage limit. Please try again later or contact support."
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                error: "Invalid token",
                details: "Please login again"
            });
        }

        if (error.code === 'ECONNABORTED') {
            return res.status(504).json({
                error: "Service timeout",
                details: "The speech service is taking too long to respond. Please try again in a few moments."
            });
        }
        
        // Handle specific error cases
        if (error.response) {
            const status = error.response.status;
            const message = (error.response.data && error.response.data.error) ||
                (error.response.data && error.response.data.message) ||
                error.message;

            return res.status(status).json({
                error: "Failed to generate speech",
                details: message
            });
        } else if (error.request) {
            return res.status(503).json({
                error: "Service unavailable",
                details: "The speech service is currently unavailable. Please try again later."
            });
        } else {
            return res.status(500).json({
                error: "Internal server error",
                details: "An unexpected error occurred. Please try again."
            });
        }
    }
};