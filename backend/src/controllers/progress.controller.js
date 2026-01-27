import { updateProgress } from '../services/progressTracking.service.js';
import mongoose from 'mongoose';

/**
 * Controller to handle progress updates for a skill in a learning path.
 */
export const updateSkillProgress = async (req, res) => {
    try {
        const { resumeId, skill, status } = req.body;

        // 1. Basic validation: Check if all fields are provided
        if (!resumeId || !skill || !status) {
            return res.status(400).json({
                success: false,
                message: "Please provide resumeId, skill, and status."
            });
        }

        // 2. Format validation: Check if resumeId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(resumeId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Resume ID format."
            });
        }

        // 3. Call the service to update the database
        const updatedPath = await updateProgress(resumeId, skill, status);

        // 4. Return success response
        return res.status(200).json({
            success: true,
            message: `Progress for '${skill}' updated to '${status}' successfully!`,
            data: updatedPath
        });

    } catch (error) {
        console.error("Error in updateSkillProgress controller:", error.message);

        // Handle specific service errors (like "not found")
        if (error.message.includes("not found") || error.message.includes("Invalid status")) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        // Fallback for unexpected server errors
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export default {
    updateSkillProgress
};
