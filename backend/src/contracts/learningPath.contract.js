/**
 * LEARNING_PATH_RESPONSE_SCHEMA
 * Source of truth for the refined learning path data contract.
 */
export const LEARNING_PATH_RESPONSE_SCHEMA = {
    resumeId: "String",
    targetRole: "String",
    experienceLevel: "String",
    roadmap: [
        {
            skill: "String",
            level: "Beginner | Intermediate | Advanced",
            reason: "String",
            estimatedTime: "String",
            depth: "Internship | Job"
        }
    ]
};

export default LEARNING_PATH_RESPONSE_SCHEMA;
