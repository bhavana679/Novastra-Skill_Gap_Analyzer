import SKILL_DEPENDENCIES from '../config/skillDependencies.js';

export const generateLearningPath = (resume, targetRole) => {
    const roleRequirements = SKILL_DEPENDENCIES[targetRole];

    if (!roleRequirements) {
        return [];
    }

    const userSkills = (resume.skills || []).map(skill => skill.toLowerCase());

    const missingSkills = roleRequirements.filter(req =>
        !userSkills.includes(req.skill.toLowerCase())
    );

    const learningPath = missingSkills.map((requirement, index) => ({
        skill: requirement.skill,
        level: requirement.level,
        order: index + 1
    }));

    return learningPath;
};

export default generateLearningPath;
