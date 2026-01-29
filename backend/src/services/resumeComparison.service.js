export const compareResumes = (oldResume, newResume) => {
    if (!oldResume || !newResume) {
        return {
            newSkills: [],
            removedSkills: [],
            improvedAreas: []
        };
    }

    const oldSkills = oldResume.skills || [];
    const newSkills = newResume.skills || [];

    const addedSkills = newSkills.filter(skill => !oldSkills.includes(skill));
    const removedSkills = oldSkills.filter(skill => !newSkills.includes(skill));

    const improvedAreas = [];
    let growthScore = addedSkills.length * 10;

    if (newResume.experienceLevel && oldResume.experienceLevel) {
        if (newResume.experienceLevel !== oldResume.experienceLevel) {
            improvedAreas.push(`Experience level evolved from ${oldResume.experienceLevel} to ${newResume.experienceLevel}`);
            growthScore += 25;
        }
    }

    if (addedSkills.length > 0) {
        improvedAreas.push(`Acquired ${addedSkills.length} new professional skills including ${addedSkills.slice(0, 2).join(', ')}`);
    }

    const oldEducation = oldResume.education || [];
    const newEducation = newResume.education || [];

    if (newEducation.length > oldEducation.length) {
        improvedAreas.push('Expanded educational background or certifications');
        growthScore += 15;
    }

    return {
        newSkills: addedSkills,
        removedSkills: removedSkills,
        improvedAreas: improvedAreas,
        growthScore: Math.min(100, growthScore)
    };
};
