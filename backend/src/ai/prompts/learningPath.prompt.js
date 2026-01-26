/**
 * @param {Object} data
 * @param {string} data.targetRole
 * @param {string} data.experienceLevel
 * @param {string[]} data.missingSkills
 * @param {Array} data.baseLearningPath
 * @returns {string}
 */
export const buildLearningPathPrompt = ({ targetRole, experienceLevel, missingSkills, baseLearningPath }) => {
    const missingSkillsList = missingSkills.join(", ");
    const currentPathJson = JSON.stringify(baseLearningPath, null, 2);

    return `
You are an expert Career Coach and Technical Mentor. I need you to refine a learning path for a user who wants to become a ${targetRole}.

### User Context:
- **Target Role:** ${targetRole}
- **Current Experience Level:** ${experienceLevel}
- **Identified Skill Gaps:** ${missingSkillsList}

### Current Learning Steps:
${currentPathJson}

### Your Task:
Please refine the learning path above. For each skill in the list, provide the following details:
1. **Rationale:** Explain why this skill is essential for a ${targetRole}.
2. **Estimated Time:** How long should a person at the ${experienceLevel} level take to learn the basics of this skill?
3. **Depth of Knowledge:** Should they focus on "Internship-ready" basics or "Job-ready" advanced concepts?
4. **Learning Resources:** Briefly suggest what type of projects or topics they should build to master it.

### Rules:
- **Maintain Order:** DO NOT change the sequence of the skills provided in the Current Learning Steps.
- **Tone:** Be encouraging, professional, and practical.
- **Format:** Return the response as a clear, structured list or JSON-like breakdown for each step.
    `;
};
