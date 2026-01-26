const ROLE_SKILL_TEMPLATES = {
    'Frontend Developer': [
        'html', 'css', 'javascript', 'react', 'vue', 'angular', 'typescript', 'next.js'
    ],
    'Backend Developer': [
        'node.js', 'python', 'java', 'sql', 'mongodb', 'express', 'postgresql', 'php', 'go'
    ],
    'Full Stack Developer': [
        'javascript', 'html', 'css', 'react', 'node.js', 'sql', 'mongodb', 'git'
    ],
    'Data Scientist': [
        'python', 'sql', 'machine learning', 'data analysis', 'pandas', 'numpy', 'r'
    ],
    'DevOps Engineer': [
        'aws', 'docker', 'git', 'kubernetes', 'linux', 'python', 'jenkins'
    ],
    'Project Manager': [
        'project management', 'agile', 'scrum', 'communication', 'agile', 'jira'
    ]
};

export const analyzeSkillGap = (extractedSkills = [], targetRole = '') => {
    const userSkills = extractedSkills.map(skill => skill.toLowerCase());

    const requiredSkills = ROLE_SKILL_TEMPLATES[targetRole] || [];

    const matchedSkills = [];
    const missingSkills = [];

    requiredSkills.forEach(skill => {
        if (userSkills.includes(skill.toLowerCase())) {
            matchedSkills.push(skill);
        } else {
            missingSkills.push(skill);
        }
    });

    return {
        matchedSkills,
        missingSkills,
        weakSkills: []
    };
};

export default analyzeSkillGap;
