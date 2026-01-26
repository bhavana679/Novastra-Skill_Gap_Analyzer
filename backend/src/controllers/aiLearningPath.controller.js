import mongoose from 'mongoose';
import Resume from '../models/Resume.js';
import LearningPath from '../models/LearningPath.js';
import { buildLearningPathPrompt } from '../ai/prompts/learningPath.prompt.js';
import { refineLearningPathWithAI } from '../services/aiLearningPath.service.js';


export const refineLearningPath = async (req, res) => {
    try {
        const { resumeId } = req.body;

        if (!resumeId) {
            return res.status(400).json({
                success: false,
                message: "Please provide a resumeId."
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

        const baseLearningPath = await LearningPath.findOne({ resumeId });
        if (!baseLearningPath) {
            return res.status(404).json({
                success: false,
                message: "No base learning path found for this resume. Please generate one first."
            });
        }

        const userSkills = resume.skills || [];
        const pathSkills = baseLearningPath.steps.map(step => step.skill);

        const prompt = buildLearningPathPrompt({
            targetRole: baseLearningPath.targetRole,
            experienceLevel: resume.experienceLevel || "Beginner",
            missingSkills: pathSkills,
            baseLearningPath: baseLearningPath.steps
        });

        const refinedSteps = await refineLearningPathWithAI(prompt);

        return res.status(200).json({
            success: true,
            message: "Learning path refined successfully using AI!",
            data: {
                resumeId,
                targetRole: baseLearningPath.targetRole,
                refinedSteps
            }
        });

    } catch (error) {
        console.error("Error in refineLearningPath controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};
