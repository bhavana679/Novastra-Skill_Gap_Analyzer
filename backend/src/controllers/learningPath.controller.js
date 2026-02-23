import mongoose from 'mongoose';
import LearningPath from '../models/LearningPath.js';
import { generateOrUpdatePath } from '../services/learningPathGenerator.service.js';

export const createLearningPath = async (req, res) => {
    try {
        const { resumeId, targetRole, experienceLevel, timeAvailability } = req.body;

        if (!resumeId || !targetRole) {
            return res.status(400).json({
                success: false,
                message: "Please provide both resumeId and targetRole."
            });
        }

        if (!mongoose.Types.ObjectId.isValid(resumeId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Resume ID format."
            });
        }

        // Use the centralized service
        const savedPath = await generateOrUpdatePath({
            resumeId,
            targetRole,
            experienceLevel,
            timeAvailability
        });

        return res.status(201).json({
            success: true,
            message: "AI Learning path generated successfully!",
            data: savedPath
        });

    } catch (error) {
        console.error("Error in createLearningPath controller:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

export const getLearningPathByResumeId = async (req, res) => {
    try {
        const { resumeId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(resumeId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Resume ID format."
            });
        }

        const learningPath = await LearningPath.findOne({ resumeId });

        if (!learningPath) {
            return res.status(404).json({
                success: false,
                message: "Learning path not found."
            });
        }

        return res.status(200).json({
            success: true,
            data: learningPath
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};
