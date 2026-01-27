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

    if (newResume.experienceLevel && oldResume.experienceLevel) {
        if (newResume.experienceLevel !== oldResume.experienceLevel) {
            improvedAreas.push(`Experience level changed from ${oldResume.experienceLevel} to ${newResume.experienceLevel}`);
        }
    }

    const oldEducation = oldResume.education || [];
    const newEducation = newResume.education || [];

    if (newEducation.length > oldEducation.length) {
        improvedAreas.push('Added new education or certifications');
    }

    return {
        newSkills: addedSkills,
        removedSkills: removedSkills,
        improvedAreas: improvedAreas
    };
};
