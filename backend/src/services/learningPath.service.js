import SKILL_DEPENDENCIES from '../config/skillDependencies.js';

export const generateLearningPath = (resume, targetRole = "") => {
    // Case-insensitive lookup for the target role
    const roleKey = Object.keys(SKILL_DEPENDENCIES).find(key =>
        key.toLowerCase() === targetRole.toLowerCase() ||
        targetRole.toLowerCase().includes(key.toLowerCase())
    );

    const roleRequirements = roleKey ? SKILL_DEPENDENCIES[roleKey] : null;

    if (!roleRequirements) {
        return [];
    }

    const userSkills = (resume.skills || []).map(skill => skill.toLowerCase());

    const missingSkills = roleRequirements.filter(req =>
        !userSkills.some(uSkill => uSkill.includes(req.skill.toLowerCase()) || req.skill.toLowerCase().includes(uSkill))
    );

    const learningPath = missingSkills.map((requirement, index) => ({
        skill: requirement.skill,
        level: requirement.level,
        order: index + 1,
        status: "NOT_STARTED",
        estimatedTime: "1-2 weeks",
        reason: `Critical foundation for ${targetRole || 'your career'}.`,
        microTopics: ["Fundamentals", "Core Concepts", "Best Practices"],
        resources: [
            { title: "Documentation", url: "https://google.com", type: "Article" },
            { title: "Video Tutorial", url: "https://youtube.com", type: "Video" }
        ]
    }));

    return learningPath;
};

export default generateLearningPath;
