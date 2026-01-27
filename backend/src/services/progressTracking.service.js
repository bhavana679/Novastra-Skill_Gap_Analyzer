import LearningPath from '../models/LearningPath.js';

/**
 * Updates the progress status of a specific skill in a user's learning path.
 * 
 * @param {string} resumeId - The ID of the resume associated with the learning path.
 * @param {string} skill - The name of the skill to update.
 * @param {string} status - The new status (NOT_STARTED, IN_PROGRESS, COMPLETED).
 * @returns {Promise<Object>} - The updated learning path document.
 * @throws {Error} - If status is invalid or learning path is not found.
 */
export const updateProgress = async (resumeId, skill, status) => {
    const validStatuses = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status: ${status}. Must be one of: ${validStatuses.join(', ')}`);
    }

    // We use Mongoose's positional operator ($) to update the specific element in the steps array
    const updatedPath = await LearningPath.findOneAndUpdate(
        {
            resumeId: resumeId,
            "steps.skill": skill
        },
        {
            $set: {
                "steps.$.status": status,
                "steps.$.updatedAt": new Date()
            }
        },
        {
            new: true // This option returns the updated document instead of the old one
        }
    );

    if (!updatedPath) {
        throw new Error('Learning path or specific skill not found for this resumeId.');
    }

    return updatedPath;
};

export default {
    updateProgress
};
