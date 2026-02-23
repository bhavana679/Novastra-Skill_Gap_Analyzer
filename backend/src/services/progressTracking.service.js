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
            new: true
        }
    );

    if (!updatedPath) {
        throw new Error('Learning path or specific skill not found for this resumeId.');
    }

    const totalSteps = updatedPath.steps.length;
    const completedSteps = updatedPath.steps.filter(s => s.status === 'COMPLETED').length;
    const currentScore = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

    // Standardize date to comparison (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];

    // Find if we already have an entry for today
    const historyIndex = updatedPath.scoreHistory.findIndex(h =>
        new Date(h.date).toISOString().split('T')[0] === today
    );

    if (historyIndex !== -1) {
        // Update today's entry
        updatedPath.scoreHistory[historyIndex].score = currentScore;
    } else {
        // Add new entry for a new day
        updatedPath.scoreHistory.push({
            score: currentScore,
            date: new Date()
        });
    }

    await updatedPath.save();

    return updatedPath;
};

export default {
    updateProgress
};
