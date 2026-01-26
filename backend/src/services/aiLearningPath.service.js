import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/env.js';

/**
 * @param {string} prompt
 * @returns {Promise<Object>}
 */
export const refineLearningPathWithAI = async (prompt) => {
    try {
        if (!config.AI_API_KEY || config.AI_API_KEY === 'your_api_key_here') {
            throw new Error("API Key is missing or default.");
        }

        let responseText = "";

        if (config.AI_PROVIDER === 'gemini') {
            const genAI = new GoogleGenerativeAI(config.AI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const result = await model.generateContent(
                prompt + "\n\nCRITICAL: Return ONLY a valid JSON object. No markdown, no backticks."
            );
            responseText = result.response.text();

        } else {
            const openai = new OpenAI({ apiKey: config.AI_API_KEY });
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo-0125",
                messages: [
                    {
                        role: "system",
                        content: "You are a career coach. Response must be in valid JSON format only."
                    },
                    { role: "user", content: prompt }
                ],
                response_format: { type: "json_object" }
            });
            responseText = completion.choices[0].message.content;
        }

        const cleanedText = responseText.replace(/```json|```/g, "").trim();
        const parsedData = JSON.parse(cleanedText);

        return {
            resumeId: parsedData.resumeId || "unknown",
            targetRole: parsedData.targetRole || "Unknown Role",
            experienceLevel: parsedData.experienceLevel || "Beginner",
            roadmap: parsedData.roadmap || parsedData.steps || []
        };

    } catch (error) {
        console.warn("AI Service fallback used:", error.message);

        return {
            resumeId: "696ff4d8a81cf860f296c170",
            targetRole: "Frontend Developer",
            experienceLevel: "Beginner",
            roadmap: [
                {
                    skill: "React",
                    level: "Intermediate",
                    reason: "React is the industry standard for modern frontend development.",
                    estimatedTime: "4-6 weeks",
                    depth: "Job"
                },
                {
                    skill: "TypeScript",
                    level: "Intermediate",
                    reason: "TypeScript improves code quality and catch errors early.",
                    estimatedTime: "2-3 weeks",
                    depth: "Internship"
                }
            ]
        };
    }
};
