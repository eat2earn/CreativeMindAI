import axios from "axios";
import chatModel from "../models/chatModel.js";

export const chatWithDeepSeek = async (req, res) => {
  try {
    const { messages, chatId } = req.body;
    const userId = req.user;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-r1:free",
        messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "CreativeMindAI",
        },
      }
    );
    
    if (response.data.error) {
      throw new Error(response.data.error);
    }

    // Save chat to history
    const botMessage = response.data.choices[0].message;
    const allMessages = [...messages, botMessage];
    
    // Create a title from the first user message if it's a new chat
    const title = messages[0]?.content?.slice(0, 50) + (messages[0]?.content?.length > 50 ? "..." : "");
    
    let chat;
    if (chatId) {
      // Update existing chat
      chat = await chatModel.findOneAndUpdate(
        { _id: chatId, userId },
        { 
          messages: allMessages,
          timestamp: new Date()
        },
        { new: true }
      );
    } else {
      // Create new chat
      chat = await chatModel.create({
        userId,
        title,
        messages: allMessages,
        timestamp: new Date(),
        isActive: true
      });
    }
    
    res.json({ ...response.data, chatId: chat._id });
  } catch (error) {
    console.error("ChatBot Error:", error);
    res.status(500).json({
      error: error.response?.data?.error || error.message || "Failed to get response from AI",
    });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const userId = req.user;
    const chats = await chatModel.find({ userId, isActive: true })
      .sort({ timestamp: -1 })
      .select('title timestamp messages')
      .limit(10);
    
    res.json({ success: true, history: chats });
  } catch (error) {
    console.error("Chat History Error:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user;

    const chat = await chatModel.findOneAndUpdate(
      { _id: chatId, userId },
      { isActive: false },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({
        success: false,
        error: "Chat not found"
      });
    }

    res.json({ success: true, message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Delete Chat Error:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};