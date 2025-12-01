
"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL_NAME = "gemini-2.5-flash";
const API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

const customResponses = [
  { pattern: /how to use proprep /i, response: "Users need to sign up via Google or email, then enter their details such as specialization and experience. Based on this, they receive insights about salaries, job requirements, and access to AI-powered career growth tools." },
  { pattern: /features of proprep/i, response: "Proprep offers AI Resume Maker, AI Cover Letter Generator, personalized mock tests, and industry insights—all in one place." },
  { pattern: /who created proprep/i, response: "Wave Setters is a team participating in GNA Hackathon 3.0, dedicated to building AI-powered career tools." },
  { pattern: /rahul/i, response: "Rahul is the owner of this Project." }
];

export async function generateResponse(prompt) {
  try {
    // 1. Check custom responses first
    for (const { pattern, response } of customResponses) {
      if (pattern.test(prompt)) return response;
    }

    // 2. Single Gemini call for both validation and response
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const combinedPrompt = `
Check if the following question is related to technology, programming, career, jobs, resumes, or IT topics. 

- If it is NOT related to these topics, respond ONLY with: 
"I can only answer questions about technology, career, and IT-related topics. Please ask something related to those fields."

- If it IS related, respond normally and answer the question.

Question: "${prompt}"
`;

    const result = await model.generateContent(combinedPrompt);
    const response = await result.response;

    return response.text();

  } catch (error) {
    console.error("Error generating response:", error);
    return "An error occurred while generating the response. Please try again.";
  }
}
