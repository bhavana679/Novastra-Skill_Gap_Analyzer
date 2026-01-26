import LearningPath from '../models/LearningPath.js';
import Resume from '../models/Resume.js';
import generateLearningPath from '../services/learningPath.service.js';
import mongoose from 'mongoose';

export const createLearningPath = async (req, res) => {
    try {
        const { resumeId, targetRole } = req.body;

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

        const resume = await Resume.findById(resumeId);

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found."
            });
        }

        const steps = generateLearningPath(resume, targetRole);

        const newLearningPath = new LearningPath({
            resumeId,
            targetRole,
            steps
        });

        const savedPath = await newLearningPath.save();

        return res.status(201).json({
            success: true,
            message: "Learning path generated successfully!",
            data: savedPath
        });

    } catch (error) {
        console.error("Error in createLearningPath controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};
