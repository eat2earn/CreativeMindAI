import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import imageRouter from "./routes/imageRoutes.js"
import userRouter from "./routes/userRoutes.js"
import chatbotRoutes from "./routes/chatbotRoutes.js";
import textToSpeechRoutes from "./routes/textToSpeechRoutes.js";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 4000
const app = express()


app.use(express.json())
app.use(cors())
await connectDB()

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/user', userRouter)
app.use('/api/image', imageRouter)
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/tts", textToSpeechRoutes);
app.get('/', (req, res) => {
    res.send('API Working')
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: err.message || 'Something went wrong!'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

app.listen(port, () => console.log(`Server started on PORT:${port}`))