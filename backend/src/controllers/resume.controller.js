import Resume from '../models/Resume.js';
import extractText from '../ocr/ocr.service.js';
import { cleanText } from '../services/textCleaner.service.js';
import { extractSkills } from '../services/skillExtractor.service.js';
import { compareResumes } from '../services/resumeComparison.service.js';

const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const rawText = await extractText(req.file.buffer, req.file.mimetype);

        const cleanedText = cleanText(rawText);

        const { skills, education, experienceLevel } = extractSkills(cleanedText);

        const profileId = req.body.profileId || req.query.profileId;

        let version = 1;

        if (profileId) {
            const latestResume = await Resume.findOne({ profileId })
                .sort({ version: -1 })
                .select('version');

            if (latestResume) {
                version = latestResume.version + 1;

                await Resume.updateMany(
                    { profileId, isActive: true },
                    { $set: { isActive: false } }
                );
            }
        }

        const savedResume = await Resume.create({
            fileName: req.file.originalname,
            ocrText: cleanedText,
            skills,
            education,
            experienceLevel,
            profileId: profileId || undefined,
            version,
            isActive: true,
            createdAt: new Date()
        });

        return res.status(200).json({
            success: true,
            resumeId: savedResume._id,
            version: savedResume.version,
            isActive: savedResume.isActive,
            text: cleanedText,
            extractedData: {
                skills,
                education,
                experienceLevel
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Error processing the resume file'
        });
    }
};

const compareResumeVersions = async (req, res) => {
    try {
        const { oldResumeId, newResumeId } = req.query;

        if (!oldResumeId || !newResumeId) {
            return res.status(400).json({
                success: false,
                message: 'Both oldResumeId and newResumeId are required'
            });
        }

        const oldResume = await Resume.findById(oldResumeId);
        const newResume = await Resume.findById(newResumeId);

        if (!oldResume || !newResume) {
            return res.status(404).json({
                success: false,
                message: 'One or both resumes not found'
            });
        }

        const comparison = compareResumes(oldResume, newResume);

        return res.status(200).json({
            success: true,
            comparison
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Error comparing resumes'
        });
    }
};

export { uploadResume, compareResumeVersions };
