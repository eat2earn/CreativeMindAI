import express from "express";
import { chatWithDeepSeek, getChatHistory, deleteChat } from "../controllers/chatbotController.js";
import authUser from "../middlewares/auth.js";

const router = express.Router();

router.post("/chat", authUser, chatWithDeepSeek);
router.get("/history", authUser, getChatHistory);
router.delete("/chat/:chatId", authUser, deleteChat);

export default router;