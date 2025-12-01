// "use server"
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const MODEL_NAME = "gemini-1.5-flash";
// const API_KEY = process.env.GEMINI_API_KEY;

// const genAI = new GoogleGenerativeAI(API_KEY);

// // Custom responses for Wavesetters-related queries
// const customResponses = [
//   { pattern: / is wavesetters/i, response: "Wave Setters is a developer team currently participating in GNA Hackathon 3.0. They created Pro Prep, an app that helps users make resumes, give mock tests, and generate cover letters—all with AI assistance." },
//   { pattern: /do/i, response: "Wave Setters provides AI-driven industry insights and tools like AI Resume Maker, AI Cover Letter Generator, and mock tests tailored to users' preferences and technology expertise." },
//   { pattern: /how to use /i, response: "Users need to sign up via Google or email, then enter their details such as specialization and experience. Based on this, they receive insights about salaries, job requirements, and access to AI-powered career growth tools." },
//   { pattern: /features of proprep/i, response: "Proprep offers AI Resume Maker, AI Cover Letter Generator, personalized mock tests, and industry insights—all in one place." },
//   { pattern: /who created proprep/i, response: "Wave Setters is a team participating in GNA Hackathon 3.0, dedicated to building AI-powered career tools." }
//   ,{ pattern: /rahul/i, response: "Rahul is the owner of this Project." }

// ];

// // Function to check if the question is valid using Gemini
// async function isValidQuestion(prompt) {
//   try {
//     const model = genAI.getGenerativeModel({ model: MODEL_NAME });
//     const result = await model.generateContent(
//       `Determine if the following question is about technology, career, or IT-related topics. Reply only "YES" or "NO".\n\nQuestion: "${prompt}"`
//     );

//     const response = await result.response;
//     const text = response.text().trim().toUpperCase();
    
//     return text === "YES"; // If Gemini says YES, it's valid
//   } catch (error) {
//     console.error("Validation error:", error);
//     return false; // Default to invalid in case of error
//   }
// }

// export async function generateResponse(prompt) {
//   try {
//     // Check for Wavesetters-related queries first
//     for (const { pattern, response } of customResponses) {
//       if (pattern.test(prompt)) {
//         return response;
//       }
//     }

//     // Validate question using Gemini
//     const isValid = await isValidQuestion(prompt);
//     if (!isValid) {
//       return "Invalid question. Please ask about technology, career, or IT-related topics.";
//     }

//     // If valid, generate response
//     const model = genAI.getGenerativeModel({ model: MODEL_NAME });
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     return response.text();
//   } catch (error) {
//     console.error("Error generating response:", error);
//     return "An error occurred while generating the response.";
//   }
// }

"use server"
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Use the new model name
const MODEL_NAME = "gemini-2.5-flash"; 

// 2. SERVER-SIDE Key: Use the private key (without NEXT_PUBLIC) if possible.
// If you only have one key in .env.local named NEXT_PUBLIC_GEMINI_API_KEY, 
// you can use that, but it is better security practice to separate them.
const API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

const customResponses = [
  { pattern: / is wavesetters/i, response: "Wave Setters is a developer team currently participating in GNA Hackathon 3.0. They created Pro Prep, an app that helps users make resumes, give mock tests, and generate cover letters—all with AI assistance." },
  { pattern: /do/i, response: "Wave Setters provides AI-driven industry insights and tools like AI Resume Maker, AI Cover Letter Generator, and mock tests tailored to users' preferences and technology expertise." },
  { pattern: /how to use /i, response: "Users need to sign up via Google or email, then enter their details such as specialization and experience. Based on this, they receive insights about salaries, job requirements, and access to AI-powered career growth tools." },
  { pattern: /features of proprep/i, response: "Proprep offers AI Resume Maker, AI Cover Letter Generator, personalized mock tests, and industry insights—all in one place." },
  { pattern: /who created proprep/i, response: "Wave Setters is a team participating in GNA Hackathon 3.0, dedicated to building AI-powered career tools." },
  { pattern: /rahul/i, response: "Rahul is the owner of this Project." }
];

async function isValidQuestion(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    // Improved prompt for better reliability
    const result = await model.generateContent(
      `Is the following question related to technology, programming, career, resumes, jobs, or IT topics? Answer only "YES" or "NO".\n\nQuestion: "${prompt}"`
    );

    const response = await result.response;
    const text = response.text().trim().toUpperCase();
    
    // Check if the response contains YES (handles cases like "YES." or "Yes")
    return text.includes("YES"); 
  } catch (error) {
    console.error("Validation error:", error);
    // If validation fails (e.g., API error), default to TRUE to avoid blocking the user unnecessarily
    return true; 
  }
}

export async function generateResponse(prompt) {
  try {
    // 1. Check Custom Responses
    for (const { pattern, response } of customResponses) {
      if (pattern.test(prompt)) {
        return response;
      }
    }

    // 2. Validate Topic
    const isValid = await isValidQuestion(prompt);
    if (!isValid) {
      return "I can only answer questions about technology, career, and IT-related topics. Please ask something related to those fields.";
    }

    // 3. Generate Answer
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error("Error generating response:", error);
    return "An error occurred while generating the response. Please try again.";
  }
}