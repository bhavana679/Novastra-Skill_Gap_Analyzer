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

const extractLinksFromText = (text) => {
    // Regex that avoids capturing common trailing punctuation inside sentences
    const urlRegex = /(?:https?:\/\/|www\.)[^\s\),;\*!]+|github\.com\/[^\s\),;\*!]+|[a-z0-9-]+\.(?:vercel\.app|netlify\.app|github\.io|herokuapp\.com|pages\.dev|web\.app)[^\s\),;\*!]*/gi;
    const matches = text.match(urlRegex) || [];
    let githubLink = '';
    let demoLink = '';

    matches.forEach(match => {
        let link = match.trim();
        // Clean trailing junk (commas, periods, brackets) often found in resume text context
        link = link.replace(/[.,;:\)\]]+$/, '');

        if (!link.startsWith('http') && !link.includes('github.com')) {
            link = 'https://' + link;
        } else if (link.startsWith('www.')) {
            link = 'https://' + link;
        } else if (link.includes('github.com') && !link.startsWith('http')) {
            link = 'https://' + link;
        }

        // Basic length check to avoid garbage matches
        if (link.length < 5) return;

        if (link.toLowerCase().includes('github.com')) {
            if (!githubLink) githubLink = link;
        } else {
            // First valid-looking non-github link is the demo
            if (!demoLink) demoLink = link;
        }
    });

    return { githubLink, demoLink };
};

export const extractSkills = (text) => {
    if (!text || typeof text !== 'string') {
        return { skills: [], projects: [], education: [], experienceLevel: 'Unknown' };
    }

    const lowerText = text.toLowerCase();

    // Enhanced skills library
    const EXTENDED_SKILLS = [
        ...SKILLS_LIBRARY,
        'react native', 'redux', 'context api', 'tailwind', 'bootstrap', 'material ui',
        'jest', 'cypress', 'mocha', 'chai', 'postgresql', 'redis', 'firebase',
        'google cloud', 'azure', 'kubernetes', 'jenkins', 'ci/cd', 'terraform',
        'graphql', 'apollo', 'rest api', 'webhook', 'oauth', 'jwt'
    ];

    const foundSkills = [];
    for (const skill of EXTENDED_SKILLS) {
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

    // --- Improved Project Extraction (Titles & Descriptions) ---
    const foundProjects = [];
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    const projectSectionHeaders = [
        'PROJECTS', 'PERSONAL PROJECTS', 'ACADEMIC PROJECTS', 'TECHNICAL PROJECTS', 'KEY PROJECTS', 'RECENT PROJECTS', 'PROJECT EXPERIENCE'
    ];

    const certSectionHeaders = [
        'CERTIFICATIONS', 'CERTIFICATES', 'LICENSES', 'AWARDS', 'ACHIEVEMENTS'
    ];

    let inProjectSection = false;
    let inCertSection = false;
    let currentProject = null;
    const foundCertifications = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const upperLine = line.toUpperCase();

        if (projectSectionHeaders.some(h => upperLine === h || upperLine.startsWith(h + ':') || upperLine.startsWith(h + ' '))) {
            inProjectSection = true;
            inCertSection = false;
            continue;
        }

        if (certSectionHeaders.some(h => upperLine === h || upperLine.startsWith(h + ':') || upperLine.startsWith(h + ' '))) {
            inCertSection = true;
            inProjectSection = false;
            continue;
        }

        const otherHeaders = ['EXPERIENCE', 'EDUCATION', 'SKILLS', 'LANGUAGES', 'SUMMARY', 'WORK HISTORY', 'OBJECTIVE', 'CONTACT', 'PROFILE'];
        if (otherHeaders.some(h => upperLine === h || upperLine.startsWith(h + ':'))) {
            inProjectSection = false;
            inCertSection = false;
            if (currentProject && currentProject.title) {
                const links = extractLinksFromText(currentProject.title + ' ' + currentProject.description);
                currentProject.githubLink = links.githubLink;
                currentProject.demoLink = links.demoLink;

                // Clean links from title
                const extractedLinks = [links.githubLink, links.demoLink].filter(Boolean);
                let cleanedTitle = currentProject.title;
                extractedLinks.forEach(link => {
                    const rawLink = link.replace(/^https?:\/\//, '');
                    cleanedTitle = cleanedTitle.replace(link, '').replace(rawLink, '').trim();
                });
                currentProject.title = cleanedTitle.replace(/[|:-]+$/, '').trim();

                foundProjects.push(currentProject);
                currentProject = null;
            }
            continue;
        }

        if (inProjectSection) {
            const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || (/^\d+[\.\)]/).test(line);

            // A title is typically a line that:
            // 1. Doesn't start with a bullet
            // 2. Is relatively short
            // 3. Or it's the very first line after a header
            if (!isBullet && line.length < 100 && line.length > 3) {
                if (currentProject && currentProject.title) {
                    const links = extractLinksFromText(currentProject.title + ' ' + currentProject.description);
                    currentProject.githubLink = links.githubLink;
                    currentProject.demoLink = links.demoLink;

                    // Clean links from title
                    const extractedLinks = [links.githubLink, links.demoLink].filter(Boolean);
                    let cleanedTitle = currentProject.title;
                    extractedLinks.forEach(link => {
                        const rawLink = link.replace(/^https?:\/\//, '');
                        cleanedTitle = cleanedTitle.replace(link, '').replace(rawLink, '').trim();
                    });
                    currentProject.title = cleanedTitle.replace(/[|:-]+$/, '').trim();

                    foundProjects.push(currentProject);
                }
                currentProject = {
                    title: line.trim(),
                    description: '',
                    githubLink: '',
                    demoLink: ''
                };
            } else if (currentProject && line.length > 1) {
                const content = line.replace(/^[•\-\*\d\.\)]+\s*/, '').trim();
                currentProject.description += (currentProject.description ? '\n' : '') + content;
            }
        }

        if (inCertSection) {
            const certLine = line.replace(/^[•\-\*\d\.\)]+\s*/, '').trim();
            if (certLine.length > 5 && certLine.length < 150) {
                const links = extractLinksFromText(certLine);
                foundCertifications.push({
                    name: certLine.split('http')[0].split('github.com')[0].trim(),
                    link: links.demoLink || links.githubLink || ''
                });
            }
        }
    }

    if (currentProject && currentProject.title) {
        const links = extractLinksFromText(currentProject.title + ' ' + currentProject.description);
        currentProject.githubLink = links.githubLink;
        currentProject.demoLink = links.demoLink;

        // Clean links from title
        const extractedLinks = [links.githubLink, links.demoLink].filter(Boolean);
        let cleanedTitle = currentProject.title;
        extractedLinks.forEach(link => {
            const rawLink = link.replace(/^https?:\/\//, '');
            cleanedTitle = cleanedTitle.replace(link, '').replace(rawLink, '').trim();
        });
        currentProject.title = cleanedTitle.replace(/[|:-]+$/, '').trim();

        foundProjects.push(currentProject);
    }

    if (foundProjects.length === 0) {
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].toLowerCase().includes('project') && lines[i].length < 80) {
                const title = lines[i].replace(/^[•\-\*\d\.]+\s*/, '').trim();
                const desc = lines[i + 1] ? lines[i + 1].trim() : '';
                const links = extractLinksFromText(title + ' ' + desc);
                foundProjects.push({
                    title: title,
                    description: desc,
                    githubLink: links.githubLink,
                    demoLink: links.demoLink
                });
                if (foundProjects.length >= 3) break;
            }
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
        skills: [...new Set(foundSkills)],
        projects: foundProjects.slice(0, 10),
        education: foundEducation,
        certifications: foundCertifications,
        experienceLevel: experienceLevel
    };
};

export default extractSkills;
