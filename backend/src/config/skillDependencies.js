/**
 * Configuration for skill dependencies by career role.
 * This defines the learning order and difficulty level for each skill
 * required to achieve a specific target role.
 */
const SKILL_DEPENDENCIES = {
    "Frontend Developer": [
        { skill: "HTML", level: "Beginner" },
        { skill: "CSS", level: "Beginner" },
        { skill: "JavaScript", level: "Beginner" },
        { skill: "React", level: "Intermediate" },
        { skill: "TypeScript", level: "Intermediate" },
        { skill: "Next.js", level: "Advanced" }
    ],
    "Backend Developer": [
        { skill: "JavaScript", level: "Beginner" },
        { skill: "Node.js", level: "Intermediate" },
        { skill: "Express", level: "Intermediate" },
        { skill: "SQL", level: "Intermediate" },
        { skill: "MongoDB", level: "Intermediate" },
        { skill: "System Design", level: "Advanced" }
    ],
    "Full Stack Developer": [
        { skill: "HTML/CSS", level: "Beginner" },
        { skill: "JavaScript", level: "Beginner" },
        { skill: "Node.js", level: "Intermediate" },
        { skill: "React", level: "Intermediate" },
        { skill: "Databases", level: "Intermediate" },
        { skill: "Cloud Deployment", level: "Advanced" }
    ],
    "Data Scientist": [
        { skill: "Python", level: "Beginner" },
        { skill: "SQL", level: "Intermediate" },
        { skill: "Data Analysis", level: "Intermediate" },
        { skill: "Pandas/NumPy", level: "Intermediate" },
        { skill: "Machine Learning", level: "Advanced" },
        { skill: "AI Model Tuning", level: "Advanced" }
    ],
    "DevOps Engineer": [
        { skill: "Linux", level: "Beginner" },
        { skill: "Git", level: "Beginner" },
        { skill: "Python", level: "Intermediate" },
        { skill: "Docker", level: "Intermediate" },
        { skill: "AWS/Cloud", level: "Advanced" },
        { skill: "Kubernetes", level: "Advanced" }
    ],
    "Project Manager": [
        { skill: "Communication", level: "Beginner" },
        { skill: "Project Management", level: "Beginner" },
        { skill: "Agile", level: "Intermediate" },
        { skill: "Scrum", level: "Intermediate" },
        { skill: "Portfolio Management", level: "Advanced" }
    ]
};

export default SKILL_DEPENDENCIES;
