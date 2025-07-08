import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { appConfig } from "../config";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: appConfig.ai_key.gemini_ai });

async function generateContent(prompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating content:", error);
  }
}

export default generateContent;
