import { chatWithAI } from '../services/aiLearningPath.service.js';
import Resume from '../models/Resume.js';
import ChatHistory from '../models/ChatHistory.js';
import mongoose from 'mongoose';

export const handleChat = async (req, res) => {
    try {
        const { message, resumeId, currentSkill, targetRole } = req.body;
        // Assume req.user is populated by auth middleware, or handle anonymous if needed (but memory requires user/session)
        const userId = req.user ? req.user._id : null;

        if (!message) {
            return res.status(400).json({ success: false, message: "Message is required." });
        }

        if (!userId) {
            // If not authenticated, we can't store memory reliably. 
            // For now, proceed without memory or require auth. 
            // Given the request "add memory agent", auth is practically required.
        }

        let resumeText = "";
        if (resumeId && mongoose.Types.ObjectId.isValid(resumeId)) {
            const resume = await Resume.findById(resumeId).select('ocrText');
            if (resume) {
                resumeText = resume.ocrText;
            }
        }

        // 1. Fetch Context / History
        let history = [];
        if (userId) {
            const historyQuery = { userId };

            // Isolate by skill if provided, otherwise fetch general chat
            if (currentSkill) {
                historyQuery["context.skill"] = currentSkill;
            } else {
                // For general chat, we want items where skill is null, undefined, or empty
                historyQuery["context.skill"] = { $in: [null, undefined, ""] };
            }

            const historyDocs = await ChatHistory.find(historyQuery)
                .sort({ createdAt: -1 })
                .limit(10);

            history = historyDocs.reverse().map(doc => ({
                role: doc.role,
                content: doc.message
            }));
        }

        // 2. Call AI with History
        const response = await chatWithAI(message, {
            targetRole,
            currentSkill,
            resumeText
        }, history);

        // 3. Save User Message
        if (userId) {
            await ChatHistory.create({
                userId,
                role: 'user',
                message,
                context: { skill: currentSkill, targetRole }
            });

            // 4. Save AI Response
            await ChatHistory.create({
                userId,
                role: 'ai',
                message: response,
                context: { skill: currentSkill, targetRole }
            });
        }

        return res.status(200).json({
            success: true,
            reply: response
        });

    } catch (error) {
        console.error("Chat Controller Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const getChatHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        const { limit = 50, skill } = req.query;

        const historyQuery = { userId };
        if (skill) {
            historyQuery["context.skill"] = skill;
        } else {
            // General chat history
            historyQuery["context.skill"] = { $in: [null, undefined, ""] };
        }

        const history = await ChatHistory.find(historyQuery)
            .sort({ createdAt: 1 }) // Oldest first for chat UI
            .limit(parseInt(limit));

        return res.status(200).json({
            success: true,
            history: history.map(h => ({
                id: h._id,
                role: h.role,
                content: h.message,
                createdAt: h.createdAt
            }))
        });

    } catch (error) {
        console.error("Get History Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch chat history"
        });
    }
};
