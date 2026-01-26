import mongoose from 'mongoose';
import LearningPath from '../models/LearningPath.js';
import { recommendResources } from '../services/resourceRecommendation.service.js';

/**
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise<Response>}
 */
export const getResourceRecommendations = async (req, res) => {
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

        const learningPath = await LearningPath.findOne({ resumeId });

        if (!learningPath) {
            return res.status(404).json({
                success: false,
                message: "No learning path found for this resume. Please generate one first."
            });
        }

        const recommendations = recommendResources(learningPath.steps);

        return res.status(200).json({
            success: true,
            message: "Resources recommended successfully!",
            data: recommendations
        });

    } catch (error) {
        console.error("Error in getResourceRecommendations controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};
