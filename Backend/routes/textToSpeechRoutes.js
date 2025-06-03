import express from "express";
import { textToSpeech } from "../controllers/textToSpeechController.js";
const router = express.Router();

router.post("/generate", textToSpeech);

export default router;