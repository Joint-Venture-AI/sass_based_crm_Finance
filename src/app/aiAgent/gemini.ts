/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import dotenv from "dotenv";
import { appConfig } from "../config";
import OpenAI from "openai";

dotenv.config();

const client = new OpenAI({
  apiKey: appConfig.ai_key.gemini_ai,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

async function generateContent(prompt: string) {
  console.log(prompt);

  const response = await client.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt,
          },
          // {
          //   type: "input_audio",
          //   input_audio: {
          //     data: base64Audio,
          //     format: "wav",
          //   },
          // },
        ],
      },
    ],
  });
  return response.choices[0].message.content;
}

export default generateContent;
