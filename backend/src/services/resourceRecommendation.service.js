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
        const skillName = step.skill;
        const resources = RESOURCE_LIBRARY[skillName] || [];

        return {
            skill: skillName,
            recommendations: resources
        };
    });

    return recommendations;
};

export default recommendResources;
