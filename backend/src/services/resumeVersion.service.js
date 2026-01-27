import Resume from '../models/Resume.js';

export const getActiveResumeByProfile = async (profileId) => {
    return await Resume.findOne({ profileId, isActive: true });
};

export const getAllResumeVersions = async (profileId) => {
    return await Resume.find({ profileId }).sort({ version: -1 });
};

export const getResumeByVersion = async (profileId, version) => {
    return await Resume.findOne({ profileId, version });
};

export const getLatestVersion = async (profileId) => {
    const resume = await Resume.findOne({ profileId })
        .sort({ version: -1 })
        .select('version');
    return resume ? resume.version : 0;
};
