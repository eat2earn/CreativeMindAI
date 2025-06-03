import userModel from "../models/userModel.js";
import { Together } from "together-ai";


const together = new Together({
    apiKey: process.env.TOGETHER_API_KEY,
});

export const generateImage = async (req, res) => {
  try {
    const userId = req.user;
    const { prompt } = req.body;

    const user = await userModel.findById(userId);

    if (!user || !prompt) {
      return res.json({ success: false, message: "Missing Details" });
    }

    if (user.creditBalance <= 0) {
      return res.json({
        success: false,
        message: "No Credit Balance",
        creditBalance: user.creditBalance,
      });
    }

    const response = await together.images.create({
      model: "black-forest-labs/FLUX.1-dev",
      prompt: prompt,
      steps: 10,
      n: 1,
    });

    console.log("Together AI Response:", JSON.stringify(response, null, 2));

    // ✅ अब image URL से भेज रहे हैं
    const imageUrl = response?.data?.[0]?.url;

    if (!imageUrl) {
      return res.json({ success: false, message: "Image generation failed" });
    }

    // Reduce credit
    await userModel.findByIdAndUpdate(user._id, {
      creditBalance: user.creditBalance - 1,
    });

    return res.json({
      success: true,
      message: "Image Generated",
      creditBalance: user.creditBalance - 1,
      resultImage: imageUrl, // ✅ URL भेजा जा रहा है
    });
  } catch (error) {
    console.error("Together AI Error:", error?.response?.data || error.message);
    res.json({
      success: false,
      message: "Failed to generate image from Together AI",
      details: error?.response?.data || error.message,
    });
  }
};
