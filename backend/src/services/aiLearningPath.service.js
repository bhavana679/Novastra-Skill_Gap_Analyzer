import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/env.js';

// Groq API client (using fetch for simplicity)
const groqModels = ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768', 'gemma-7b-it'];

// Helper: Sleep for retry delays
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: Exponential backoff retry
async function withRetry(fn, maxRetries = 3, baseDelay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            const isRateLimit = error.message?.includes('429') ||
                error.message?.includes('rate limit') ||
                error.message?.includes('quota');
            if (i === maxRetries - 1 || !isRateLimit) throw error;
            const delay = baseDelay * Math.pow(2, i);
            console.warn(`Retry ${i + 1}/${maxRetries} after ${delay}ms:`, error.message);
            await sleep(delay);
        }
    }
}

// Helper: Call Groq API
async function callGroqAPI(prompt, model = 'llama-3.3-70b-versatile') {
    const apiKey = config.GROQ_API_KEY || config.AI_API_KEY;
    if (!apiKey) throw new Error("Groq API key not configured");

    const response = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: model,
            messages: [
                { role: "system", content: "You are a career coach. Response must be in valid JSON format only." },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 4000
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Groq API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

// Helper: Call OpenAI API
async function callOpenAIAPI(prompt, model = "gpt-3.5-turbo-0125") {
    const openai = new OpenAI({ apiKey: config.AI_API_KEY });
    const completion = await openai.chat.completions.create({
        model: model,
        messages: [
            { role: "system", content: "You are a career coach. Response must be in valid JSON format only." },
            { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7
    });
    return completion.choices[0].message.content;
}

// Helper: Call Gemini API
async function callGeminiAPI(prompt, modelName = "gemini-pro") {
    const genAI = new GoogleGenerativeAI(config.AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: modelName });

    const result = await model.generateContent(
        prompt + "\n\nCRITICAL: Return ONLY a valid JSON object. No markdown, no backticks."
    );
    return result.response.text();
}

// Helper: Parse JSON from AI response
function parseAIResponse(responseText) {
    let cleanedText = responseText.replace(/```json|```/g, "").trim();

    // Find the first { and last } to extract JSON
    const firstBrace = cleanedText.indexOf('{');
    const lastBrace = cleanedText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
        cleanedText = cleanedText.substring(firstBrace, lastBrace + 1);
    }

    return JSON.parse(cleanedText);
}

// Helper: Normalize skill level
function normalizeLevel(level) {
    const validLevels = ["Beginner", "Intermediate", "Advanced"];
    if (validLevels.includes(level)) return level;

    const lower = level?.toLowerCase() || "";
    if (lower.includes("adv") || lower.includes("expert") || lower.includes("senior")) return "Advanced";
    if (lower.includes("int") || lower.includes("mid") || lower.includes("junior")) return "Intermediate";
    return "Beginner";
}

// Helper: Validate and fix URLs
function validateUrl(url, skill) {
    const isHomepage = url === "https://youtube.com" || url === "https://www.youtube.com" || url === "https://google.com" || url === "https://www.google.com";
    if (!url || isHomepage || url.length < 15 || !url.startsWith("http")) {
        const query = encodeURIComponent(`${skill} tutorial technical guide`);
        // If it's a video search, use YouTube, otherwise Google
        return `https://www.youtube.com/results?search_query=${query}`;
    }
    return url;
}

// Helper: Convert AI response to roadmap format
function convertToRoadmap(parsedData) {
    const steps = (parsedData.steps || parsedData.roadmap || []).map((step, index) => ({
        skill: step.skill || step.title || "Unknown Skill",
        level: normalizeLevel(step.level),
        order: index + 1,
        status: "NOT_STARTED",
        estimatedTime: step.estimatedTime || step.duration || "1 week",
        reason: step.reason || step.description || "Essential skill for your career",
        microTopics: step.microTopics || step.topics || [],
        resources: (step.resources || []).map(r => ({
            ...r,
            url: validateUrl(r.url, step.skill || step.title)
        }))
    }));

    return {
        steps,
        insight: parsedData.insight || "Your career path is uniquely yours. Stay consistent and keep building.",
        growthFactor: parsedData.growthFactor || "High"
    };
}

// Local fallback - rules-based learning path generation
function generateLocalFallback(targetRole, currentSkills = []) {
    const roleLearningPaths = {
        'frontend developer': [
            { skill: 'HTML/CSS', level: 'Beginner', estimatedTime: '2 weeks', reason: 'Foundation of web development', microTopics: ['Semantic HTML', 'Flexbox', 'Grid'] },
            { skill: 'JavaScript', level: 'Beginner', estimatedTime: '4 weeks', reason: 'Core language for web interactivity', microTopics: ['ES6+', 'DOM', 'Async/Await'] },
            { skill: 'React', level: 'Intermediate', estimatedTime: '3 weeks', reason: 'Most popular frontend framework', microTopics: ['Components', 'Hooks', 'State Management'] },
            { skill: 'TypeScript', level: 'Intermediate', estimatedTime: '2 weeks', reason: 'Type safety for large applications', microTopics: ['Types', 'Interfaces', 'Generics'] },
            { skill: 'CSS Frameworks', level: 'Intermediate', estimatedTime: '1 week', reason: 'Rapid UI development', microTopics: ['Tailwind', 'Bootstrap'] }
        ],
        'backend developer': [
            { skill: 'Node.js', level: 'Beginner', estimatedTime: '3 weeks', reason: 'JavaScript on the server', microTopics: ['Express', 'Event Loop', 'NPM'] },
            { skill: 'Python', level: 'Beginner', estimatedTime: '4 weeks', reason: 'Versatile backend language', microTopics: ['Django', 'Flask', 'REST APIs'] },
            { skill: 'Databases', level: 'Intermediate', estimatedTime: '3 weeks', reason: 'Data persistence and management', microTopics: ['SQL', 'NoSQL', 'ORM'] },
            { skill: 'API Design', level: 'Intermediate', estimatedTime: '2 weeks', reason: 'Building robust APIs', microTopics: ['REST', 'GraphQL', 'Authentication'] },
            { skill: 'Docker', level: 'Advanced', estimatedTime: '2 weeks', reason: 'Containerization for deployment', microTopics: ['Containers', 'Dockerfile', 'Docker Compose'] }
        ],
        'full stack developer': [
            { skill: 'HTML/CSS/JS', level: 'Beginner', estimatedTime: '3 weeks', reason: 'Frontend fundamentals', microTopics: ['DOM', 'Events', 'Fetch API'] },
            { skill: 'React or Vue', level: 'Intermediate', estimatedTime: '3 weeks', reason: 'Frontend framework', microTopics: ['Components', 'State', 'Routing'] },
            { skill: 'Node.js', level: 'Intermediate', estimatedTime: '3 weeks', reason: 'Server-side JavaScript', microTopics: ['Express', 'REST APIs'] },
            { skill: 'Databases', level: 'Intermediate', estimatedTime: '2 weeks', reason: 'Data management', microTopics: ['MongoDB', 'PostgreSQL'] },
            { skill: 'Git & DevOps', level: 'Intermediate', estimatedTime: '2 weeks', reason: 'Version control and deployment', microTopics: ['Git', 'CI/CD', 'Vercel/Netlify'] }
        ],
        'data scientist': [
            { skill: 'Python', level: 'Beginner', estimatedTime: '4 weeks', reason: 'Primary language for data science', microTopics: ['NumPy', 'Pandas', 'Matplotlib'] },
            { skill: 'Statistics', level: 'Intermediate', estimatedTime: '3 weeks', reason: 'Statistical foundation', microTopics: ['Probability', 'Hypothesis Testing', 'Regression'] },
            { skill: 'Machine Learning', level: 'Intermediate', estimatedTime: '4 weeks', reason: 'Core ML algorithms', microTopics: ['Scikit-learn', 'Supervised Learning', 'Unsupervised Learning'] },
            { skill: 'Deep Learning', level: 'Advanced', estimatedTime: '4 weeks', reason: 'Neural networks', microTopics: ['TensorFlow', 'PyTorch', 'CNNs'] },
            { skill: 'SQL', level: 'Intermediate', estimatedTime: '2 weeks', reason: 'Data querying', microTopics: ['Joins', 'Aggregations', 'Subqueries'] }
        ],
        'mobile developer': [
            { skill: 'Dart', level: 'Beginner', estimatedTime: '2 weeks', reason: 'Flutter language', microTopics: ['Syntax', 'OOP', 'Async'] },
            { skill: 'Flutter', level: 'Intermediate', estimatedTime: '4 weeks', reason: 'Cross-platform framework', microTopics: ['Widgets', 'State', 'Navigation'] },
            { skill: 'State Management', level: 'Intermediate', estimatedTime: '2 weeks', reason: 'App state handling', microTopics: ['Provider', 'Bloc', 'Riverpod'] },
            { skill: 'Native Features', level: 'Intermediate', estimatedTime: '2 weeks', reason: 'Device APIs', microTopics: ['Camera', 'Location', 'Notifications'] },
            { skill: 'App Deployment', level: 'Advanced', estimatedTime: '2 weeks', reason: 'Store deployment', microTopics: ['App Store', 'Play Store', 'CI/CD'] }
        ],
        'devops engineer': [
            { skill: 'Linux', level: 'Beginner', estimatedTime: '3 weeks', reason: 'Server operating system', microTopics: ['Shell', 'Permissions', 'Processes'] },
            { skill: 'Docker', level: 'Intermediate', estimatedTime: '3 weeks', reason: 'Containerization', microTopics: ['Images', 'Compose', 'Networking'] },
            { skill: 'Kubernetes', level: 'Advanced', estimatedTime: '4 weeks', reason: 'Orchestration', microTopics: ['Pods', 'Services', 'Deployments'] },
            { skill: 'CI/CD', level: 'Intermediate', estimatedTime: '2 weeks', reason: 'Automation', microTopics: ['Jenkins', 'GitHub Actions', 'Pipeline'] },
            { skill: 'Cloud Platforms', level: 'Advanced', estimatedTime: '3 weeks', reason: 'Cloud services', microTopics: ['AWS', 'GCP', 'Terraform'] }
        ]
    };

    // Default path for unknown roles
    const defaultPath = [
        { skill: 'Programming Fundamentals', level: 'Beginner', estimatedTime: '4 weeks', reason: 'Core programming concepts', microTopics: ['Variables', 'Functions', 'OOP'] },
        { skill: 'Git & Version Control', level: 'Beginner', estimatedTime: '2 weeks', reason: 'Code management', microTopics: ['Branching', 'Merging', 'Pull Requests'] },
        { skill: 'Web Development Basics', level: 'Beginner', estimatedTime: '3 weeks', reason: 'Web fundamentals', microTopics: ['HTTP', 'APIs', 'JSON'] },
        { skill: 'Database Basics', level: 'Intermediate', estimatedTime: '2 weeks', reason: 'Data storage', microTopics: ['SQL', 'Database Design'] },
        { skill: 'Testing', level: 'Intermediate', estimatedTime: '2 weeks', reason: 'Quality assurance', microTopics: ['Unit Tests', 'Integration Tests'] }
    ];

    // Find matching role or use default
    const roleKey = Object.keys(roleLearningPaths).find(key =>
        targetRole?.toLowerCase().includes(key)
    ) || 'full stack developer';

    const basePath = roleLearningPaths[roleKey] || defaultPath;

    // Filter out skills the user already has
    const userSkills = (currentSkills || []).map(s => s.toLowerCase());
    const filteredPath = basePath.filter(step =>
        !userSkills.some(skill =>
            step.skill.toLowerCase().includes(skill) ||
            skill.includes(step.skill.toLowerCase())
        )
    );

    const steps = filteredPath.map((step, index) => ({
        ...step,
        order: index + 1,
        status: "NOT_STARTED",
        resources: generateResources(step.skill)
    }));

    return {
        steps,
        insight: `Mastering these ${steps.length} key skills will significantly boost your profile for ${targetRole} roles.`,
        growthFactor: "High"
    };
}

// Helper: Generate resources for a skill
function generateResources(skill) {
    const resourceMap = {
        'react': [
            { title: 'React Official Docs', url: 'https://react.dev', type: 'Documentation' },
            { title: 'React Course by Traversy Media', url: 'https://youtube.com', type: 'Video' },
            { title: 'Full React Course', url: 'https://scrimba.com', type: 'Interactive' }
        ],
        'javascript': [
            { title: 'MDN JavaScript Guide', url: 'https://developer.mozilla.org', type: 'Documentation' },
            { title: 'JavaScript.info', url: 'https://javascript.info', type: 'Tutorial' },
            { title: 'FreeCodeCamp JS Course', url: 'https://freecodecamp.org', type: 'Course' }
        ],
        'node.js': [
            { title: 'Node.js Official Docs', url: 'https://nodejs.org', type: 'Documentation' },
            { title: 'Node.js Crash Course', url: 'https://youtube.com', type: 'Video' }
        ],
        'python': [
            { title: 'Python Official Docs', url: 'https://python.org', type: 'Documentation' },
            { title: 'Automate the Boring Stuff', url: 'https://automatetheboringstuff.com', type: 'Book' },
            { title: 'FreeCodeCamp Python Course', url: 'https://freecodecamp.org', type: 'Course' }
        ],
        'docker': [
            { title: 'Docker Official Docs', url: 'https://docs.docker.com', type: 'Documentation' },
            { title: 'Docker for Beginners', url: 'https://youtube.com', type: 'Video' }
        ],
        'typescript': [
            { title: 'TypeScript Handbook', url: 'https://typescriptlang.org', type: 'Documentation' },
            { title: 'TypeScript Course', url: 'https://youtube.com', type: 'Video' }
        ]
    };

    // Return specific resources or generic ones
    const skillLower = skill.toLowerCase();
    const specificKey = Object.keys(resourceMap).find(k => skillLower.includes(k));

    let resources = [];
    if (specificKey) {
        resources = resourceMap[specificKey];
    } else {
        resources = [
            { title: `${skill} Documentation`, url: `https://www.google.com/search?q=${encodeURIComponent(skill + " documentation official")}`, type: 'Documentation' },
            { title: `${skill} Technical Tutorial`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + " tutorial expert")}`, type: 'Video' },
            { title: `Learn ${skill} on FreeCodeCamp`, url: `https://www.freecodecamp.org/news/search/?query=${encodeURIComponent(skill)}`, type: 'Course' }
        ];
    }

    return resources.map(res => ({
        ...res,
        url: validateUrl(res.url, skill)
    }));
}

/**
 * @param {string} prompt
 * @returns {Promise<Object>}
 */
export const refineLearningPathWithAI = async (prompt, targetRole = 'developer') => {
    try {
        if (!config.AI_API_KEY && !config.GROQ_API_KEY) {
            console.warn("No AI API keys configured, using local fallback");
            throw new Error("No API keys configured");
        }

        let responseText = "";
        let usedProvider = "";

        // Strategy 1: Try the preferred provider first
        if (config.AI_PROVIDER === 'gemini' && config.AI_API_KEY) {
            try {
                responseText = await withRetry(() => callGeminiAPI(prompt), 3, 2000);
                usedProvider = "Gemini";
            } catch (error) {
                console.warn("Preferred Gemini API failed:", error.message);
            }
        } else if (config.AI_PROVIDER === 'openai' && config.AI_API_KEY) {
            try {
                responseText = await withRetry(() => callOpenAIAPI(prompt), 2, 500);
                usedProvider = "OpenAI";
            } catch (error) {
                console.warn("Preferred OpenAI API failed:", error.message);
            }
        } else if (config.AI_PROVIDER === 'groq' && (config.GROQ_API_KEY || config.AI_API_KEY)) {
            try {
                responseText = await withRetry(() => callGroqAPI(prompt), 2, 500);
                usedProvider = "Groq";
            } catch (error) {
                console.warn("Preferred Groq API failed:", error.message);
            }
        }

        // Strategy 2: Fallbacks if preferred failed or not configured
        if (!responseText) {
            // Try Groq as first fallback (best free tier)
            if (config.GROQ_API_KEY) {
                try {
                    responseText = await withRetry(() => callGroqAPI(prompt), 2, 500);
                    usedProvider = "Groq";
                } catch (error) {
                    console.warn("Groq fallback failed:", error.message);
                }
            }

            // Try Gemini as second fallback
            if (!responseText && config.AI_API_KEY) {
                try {
                    responseText = await withRetry(() => callGeminiAPI(prompt), 2, 1000);
                    usedProvider = "Gemini";
                } catch (error) {
                    console.warn("Gemini fallback failed:", error.message);
                }
            }
        }

        // If all API calls failed, use local fallback
        if (!responseText) {
            console.log("All AI APIs failed, using local rules-based fallback");
            const fallbackData = {
                steps: generateLocalFallback(targetRole)
            };
            return convertToRoadmap(fallbackData);
        }

        console.log(`Successfully used ${usedProvider} for learning path generation`);

        // Parse and normalize the response
        const parsedData = parseAIResponse(responseText);
        return convertToRoadmap(parsedData);

    } catch (error) {
        console.warn("AI Service fallback used:", error.message);

        // Final fallback to local rules-based generation
        const fallbackData = {
            steps: generateLocalFallback(targetRole)
        };
        return convertToRoadmap(fallbackData);
    }
};

/**
 * @param {string} message
 * @param {Object} context
 * @returns {Promise<string>}
 */
// Helper: Format history for AI context
function formatHistory(history) {
    if (!history || history.length === 0) return "";
    return history.map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join("\n");
}

/**
 * @param {string} message
 * @param {Object} context
 * @param {Array} chatHistory - Array of { role: 'user'|'ai', content: string }
 * @returns {Promise<string>}
 */
export const chatWithAI = async (message, context, chatHistory = []) => {
    try {
        const { targetRole, currentSkill, resumeText } = context;

        // Limit history to last 10 messages to save context window
        const recentHistory = chatHistory.slice(-10);
        const historyText = formatHistory(recentHistory);

        const systemPrompt = `
You are **Novastra AI**, an elite, encouraging, and highly technical Career Architect.
Your mission is to guide the user to become a world-class ${targetRole || "developer"}.

User Context:
- Current Focus: Mastering "${currentSkill || "general skills"}".
- Resume Summary: ${resumeText ? resumeText.substring(0, 500) + "..." : "Not available"}

Chat History:
${historyText}

Your Guidelines:
1. **Act as a Mentor**: Be supportive but pushing for excellence. Use phrases like "Let's tackle this," or "Great question."
2. **Be Specific**: If asked about ${currentSkill}, give technical depth.
3. **Provide Examples**: Always use brief code snippets or analogies for complex topics.
4. **Actionable Advice**: End with a concrete next step or a challenging question to check understanding.
5. **Memory**: Refer back to previous parts of the conversation if relevant (see Chat History).

Respond in plain text (Markdown supported). Keep it under 200 words unless asked for a detailed explanation.
        `;

        let response = "";
        let usedProvider = "";

        // Strategy 1: Preferred Provider (Gemini / OpenAI / Groq)
        // ... (existing provider logic remains similar but uses the new systemPrompt) ...

        if (config.AI_PROVIDER === 'gemini' && config.AI_API_KEY) {
            try {
                const genAI = new GoogleGenerativeAI(config.AI_API_KEY);
                const model = genAI.getGenerativeModel({ model: "gemini-pro" });
                const result = await model.generateContent(systemPrompt + "\n\nUser: " + message);
                response = result.response.text();
                usedProvider = "Gemini";
            } catch (error) {
                console.warn("Preferred Gemini chat failed:", error.message);
            }
        } else if (config.AI_PROVIDER === 'openai' && config.AI_API_KEY) {
            try {
                const openai = new OpenAI({ apiKey: config.AI_API_KEY });
                const completion = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: "system", content: systemPrompt },
                        ...recentHistory.map(h => ({ role: h.role === 'user' ? 'user' : 'assistant', content: h.content })),
                        { role: "user", content: message }
                    ],
                    temperature: 0.7
                });
                response = completion.choices[0].message.content;
                usedProvider = "OpenAI";
            } catch (error) {
                console.warn("Preferred OpenAI chat failed:", error.message);
            }
        } else if (config.AI_PROVIDER === 'groq' && (config.GROQ_API_KEY || config.AI_API_KEY)) {
            try {
                const apiKey = config.GROQ_API_KEY || config.AI_API_KEY;
                const groqResponse = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: "llama-3.3-70b-versatile",
                        messages: [
                            { role: "system", content: systemPrompt },
                            ...recentHistory.map(h => ({ role: h.role === 'user' ? 'user' : 'assistant', content: h.content })),
                            { role: "user", content: message }
                        ],
                        temperature: 0.7,
                        max_tokens: 1000
                    })
                });

                if (groqResponse.ok) {
                    const data = await groqResponse.json();
                    response = data.choices[0].message.content;
                    usedProvider = "Groq";
                }
            } catch (error) {
                console.warn("Preferred Groq chat failed:", error.message);
            }
        }

        // Strategy 2: Fallbacks
        if (!response) {
            // Groq Fallback
            if (config.GROQ_API_KEY) {
                try {
                    const groqResponse = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${config.GROQ_API_KEY}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            model: "llama-3.3-70b-versatile",
                            messages: [
                                { role: "system", content: systemPrompt },
                                { role: "user", content: message }
                            ],
                            temperature: 0.7,
                            max_tokens: 1000
                        })
                    });
                    if (groqResponse.ok) {
                        const data = await groqResponse.json();
                        response = data.choices[0].message.content;
                        usedProvider = "Groq (Fallback)";
                    }
                } catch (e) { }
            }

            // Gemini Fallback
            if (!response && config.AI_API_KEY) {
                try {
                    const genAI = new GoogleGenerativeAI(config.AI_API_KEY);
                    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
                    const result = await model.generateContent(systemPrompt + "\n\nUser: " + message);
                    response = result.response.text();
                    usedProvider = "Gemini (Fallback)";
                } catch (e) { }
            }
        }

        if (response) {
            console.log(`Chat used ${usedProvider} provider`);
            return response;
        }

        // Fallback response when all APIs fail
        return `I'm **Novastra AI**, here to help! \n\n` +
            `Since my brain is temporarily offline (API limit), here is some general advice on **${currentSkill || "coding"}**:\n` +
            `1. Focus on fundamentals.\n` +
            `2. Build projects.\n` +
            `3. Keep practicing!\n\n` +
            `_Please try again later for personalized guidance._`;

    } catch (error) {
        console.error("AI Chat Error:", error);
        return `Error: ${error.message}. Please check your API configuration or try again later.`;
    }
};

