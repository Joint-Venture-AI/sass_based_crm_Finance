/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import dotenv from "dotenv";
import { appConfig } from "../config";
import OpenAI from "openai";

dotenv.config();

const client = new OpenAI({
  apiKey: appConfig.ai_key.gemini_ai,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

// Define the schema we expect
interface CategorizedTransaction {
  type: "income" | "expense";
  amount: number;
  currency: string;
  date: string;
  description: string;
  categoryType?: string; // Only for expense
}

async function categorizeTransactions(transactions: any[]) {
  const prompt = `
You are a financial categorization agent. 
Given a list of bank transactions, classify each one as either "income" or "expense".
For expense transactions, add an extra field "categoryType" which describes what type of expense it is.
Return only valid JSON array following this schema:

[
  {
    "type": "income" | "expense",
    "amount": number,
    "currency": string,
    "date": "YYYY-MM-DD",
    "description": string,
    "categoryType"?: string // required for expense
  }
]

Transactions:
${JSON.stringify(transactions, null, 2)}
  `;

  const response = await client.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [{ role: "user", content: [{ type: "text", text: prompt }] }],
    temperature: 0, // More consistent
    response_format: { type: "json_object" },
  });

  const rawContent = response.choices[0]?.message?.content;

  try {
    return JSON.parse(rawContent as string) as CategorizedTransaction[];
  } catch (err) {
    console.error("Failed to parse AI response:", rawContent);
    throw err;
  }
}

export default categorizeTransactions;
