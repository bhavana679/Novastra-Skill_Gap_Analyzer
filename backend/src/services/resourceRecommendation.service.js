import RESOURCE_LIBRARY from '../config/resourceLibrary.js';

/**
 * @param {Array} learningPath
 * @returns {Array}
 */
export const recommendResources = (learningPath) => {
    if (!learningPath || !Array.isArray(learningPath)) {
        return [];
    }

    const recommendations = learningPath.map(step => {
        const skillName = step.skill.toLowerCase();

        // Find best match in library (case-insensitive partial match)
        const matchedKey = Object.keys(RESOURCE_LIBRARY).find(key =>
            skillName.includes(key.toLowerCase()) ||
            key.toLowerCase().includes(skillName)
        );

        const resources = matchedKey ? RESOURCE_LIBRARY[matchedKey] : [];

        return {
            skill: step.skill,
            recommendations: resources
        };
    });

    return recommendations;
};

export default recommendResources;
