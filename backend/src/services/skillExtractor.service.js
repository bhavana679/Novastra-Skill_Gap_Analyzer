const SKILLS_LIBRARY = [
    'javascript', 'python', 'java', 'react', 'node.js', 'html', 'css', 'sql', 'mongodb',
    'aws', 'docker', 'git', 'typescript', 'c++', 'c#', 'php', 'ruby', 'go', 'swift',
    'express', 'angular', 'vue', 'next.js', 'machine learning', 'data analysis',
    'agile', 'scrum', 'project management', 'communication', 'problem solving'
];

const EDUCATION_KEYWORDS = [
    'bachelor', 'master', 'phd', 'bsc', 'msc', 'b.tech', 'm.tech', 'diploma', 'degree',
    'university', 'college', 'institute'
];

export const extractSkills = (text) => {
    if (!text || typeof text !== 'string') {
        return { skills: [], education: [], experienceLevel: 'Unknown' };
    }

    const lowerText = text.toLowerCase();

    const foundSkills = [];
    for (const skill of SKILLS_LIBRARY) {
        const regex = new RegExp('\\b' + skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
        if (regex.test(lowerText)) {
            foundSkills.push(skill);
        }
    }

    const foundEducation = [];
    for (const edu of EDUCATION_KEYWORDS) {
        const regex = new RegExp('\\b' + edu + '\\b', 'i');
        if (regex.test(lowerText)) {
            foundEducation.push(edu);
        }
    }

    let experienceLevel = 'Entry Level / Junior';

    if (lowerText.match(/\bsenior\b|\blead\b|\barchitect\b|\bprincipal\b/i)) {
        experienceLevel = 'Senior';
    } else if (lowerText.match(/\bmid-level\b|\bintermediate\b/i)) {
        experienceLevel = 'Mid-level';
    } else if (lowerText.match(/\bintern\b|\binternship\b|\bfreshman\b/i)) {
        experienceLevel = 'Internship';
    }

    return {
        skills: foundSkills,
        education: foundEducation,
        experienceLevel: experienceLevel
    };
};

export default extractSkills;
