import { LEARNING_PATH_RESPONSE_SCHEMA } from '../contracts/learningPath.contract.js';

/**
 * @param {string} prompt
 * @returns {Promise<Object>}
 */
export const refineLearningPathWithAI = async (prompt) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // This mock data strictly follows the LEARNING_PATH_RESPONSE_SCHEMA contract
            const mockRefinedPayload = {
                resumeId: "696ff4d8a81cf860f296c170",
                targetRole: "Frontend Developer",
                experienceLevel: "Beginner",
                roadmap: [
                    {
                        skill: "React",
                        level: "Intermediate",
                        reason: "React is the most popular frontend library and is essential for modern web applications.",
                        estimatedTime: "4-6 weeks",
                        depth: "Job"
                    },
                    {
                        skill: "TypeScript",
                        level: "Intermediate",
                        reason: "TypeScript adds type safety to JavaScript, making large-scale applications easier to maintain.",
                        estimatedTime: "2-3 weeks",
                        depth: "Internship"
                    }
                ]
            };

            resolve(mockRefinedPayload);
        }, 1000);
    });
};
