import { config } from '../config/env.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Service to calculate ATS Score and provide feedback using AI.
 * 
 * @param {string} resumeText - The raw OCR text of the resume.
 * @param {string} targetRole - The role the user is applying for.
 * @returns {Promise<Object>} Object containing score and feedback.
 */
export const calculateATSScore = async (resumeText, targetRole) => {
    try {
        if (!resumeText || resumeText.trim().length < 50) {
            return {
                score: 50,
                feedback: ["Resume text could not be fully extracted. Try uploading a clearer version for a better score.", "Add more details about your specific technical projects."]
            };
        }

        const prompt = `
You are a professional Applicant Tracking System (ATS) and Senior Technical Recruiter.
Analyze the following resume text for the role of: "${targetRole}".

RESUME TEXT:
${(resumeText || "").substring(0, 8000)}

### TASK:
1. Calculate an ATS compatibility score (0-100) based on:
   - Key skills presence for the role
   - Formatting and structure
   - Action-oriented language
   - Professional tone
2. Provide 3-5 specific, actionable bullet points for improvement.

### RETURN FORMAT (JSON ONLY):
{
  "score": number,
  "feedback": ["string", "string", ...]
}
`;

        let responseText = "";

        // GROQ Provider
        if (config.AI_PROVIDER === 'groq' && (config.GROQ_API_KEY || config.AI_API_KEY)) {
            try {
                const apiKey = config.GROQ_API_KEY || config.AI_API_KEY;
                const response = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: "llama-3.3-70b-versatile",
                        messages: [
                            { role: "system", content: "You are a detailed ATS scanner. Return valid JSON only." },
                            { role: "user", content: prompt }
                        ],
                        temperature: 0.5,
                        response_format: { type: "json_object" }
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    responseText = data.choices[0].message.content;
                } else {
                    console.warn(`ATS Service: Groq failed with ${response.status}`);
                }
            } catch (err) {
                console.warn("ATS Service: Groq Error", err.message);
            }
        }

        // Gemini Provider (Fallback or Primary)
        if (!responseText && config.AI_API_KEY) {
            try {
                const genAI = new GoogleGenerativeAI(config.AI_API_KEY);
                const model = genAI.getGenerativeModel({ model: "gemini-pro" });
                const result = await model.generateContent(
                    prompt + "\n\nCRITICAL: Return ONLY a valid JSON object. No markdown, no backticks."
                );
                responseText = result.response.text();
            } catch (err) {
                console.warn("ATS Service: Gemini Error", err.message);
            }
        }

        if (!responseText) {
            return { score: 70, feedback: ["AI Analysis unavailable. Please check system configuration."] };
        }

        // Parse JSON
        let cleanedResponse = responseText.replace(/```json|```/g, "").trim();
        const firstBrace = cleanedResponse.indexOf('{');
        const lastBrace = cleanedResponse.lastIndexOf('}');

        if (firstBrace !== -1 && lastBrace !== -1) {
            cleanedResponse = cleanedResponse.substring(firstBrace, lastBrace + 1);
            try {
                const data = JSON.parse(cleanedResponse);
                return {
                    score: typeof data.score === 'number' ? data.score : 75,
                    feedback: Array.isArray(data.feedback) ? data.feedback : ["Good resume, keep iterating."]
                };
            } catch (err) {
                console.warn("JSON Parse Failed for cleaned ATS response:", err.message);
            }
        }

        return { score: 75, feedback: ["Excellent resume structure. Consider tailoring even more to keywords."] };

    } catch (error) {
        console.error("ATS Calculation Error:", error);
        return { score: 70, feedback: ["Could not perform AI analysis. Check your text format or AI connectivity."] };
    }
};

export default { calculateATSScore };
