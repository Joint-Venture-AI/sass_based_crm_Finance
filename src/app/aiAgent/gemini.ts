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
  tId: string;
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
    tId: string;
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
//---------------------------------------------------------------------------------------

interface FormattedAnswer {
  question: string;
  userAnswer: string;
}

interface UserSkillEvaluation {
  skill: string;
  score: number; // 0–10
  explanation: string;
}

export async function evaluateUserAnswers(answers: FormattedAnswer[]) {
  const skills = [
    "Determination",
    "Problem-Solving",
    "Adaptability",
    "Stress Management",
    "Organizational Skills",
    "Creativity",
    "Execution",
    "Principles",
    "Leadership",
    "HR Management",
    "Motivation",
    "Communication",
    "Teamwork",
    "Empathy",
    "Assertiveness",
  ];

  const prompt = `
You are an HR assessment assistant.
You will be given a set of questions and the user's answers.
Your job is to:

1. Assign numeric scores (0–10) to the following skills:
${skills.join(", ")}

2. Add a short explanation for each score.

3. Evaluate the overall **consistency of the answers** in terms of whether they align with the user's skill profile. Give a percentage score (0–100%) indicating how internally consistent the user's answers are.

Rules:
- Every skill must have a score and an explanation.
- Return ONLY valid JSON like this:

{
  "skills": [
    {
      "skill": "Determination",
      "score": 8,
      "explanation": "The user shows persistence by working until completion even if tasks are boring."
    },
    ...
  ],
  "consistency": 87
}

User Answers:
${JSON.stringify(answers, null, 2)}
`;

  const response = await client.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [{ role: "user", content: [{ type: "text", text: prompt }] }],
    temperature: 0.2, // More consistent
    response_format: { type: "json_object" },
  });

  const rawContent = response.choices[0]?.message?.content;

  try {
    const parsed = JSON.parse(rawContent as string) as {
      skills: UserSkillEvaluation[];
      consistency: number;
    };

    return parsed;
  } catch (err) {
    console.error("Failed to parse AI response:", rawContent);
    throw err;
  }
}
