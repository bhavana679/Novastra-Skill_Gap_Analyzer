/**
 * @param {string} prompt
 * @returns {Promise<Array>}
 */
export const refineLearningPathWithAI = async (prompt) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const mockRefinedPath = [
                {
                    skill: "React",
                    level: "Intermediate",
                    reason: "React is the most popular frontend library and is essential for modern web applications.",
                    estimatedTime: "4-6 weeks",
                    depth: "Job-ready"
                },
                {
                    skill: "TypeScript",
                    level: "Intermediate",
                    reason: "TypeScript adds type safety to JavaScript, making large-scale applications easier to maintain.",
                    estimatedTime: "2-3 weeks",
                    depth: "Internship-ready"
                }
            ];

            resolve(mockRefinedPath);
        }, 1000);
    });
};
