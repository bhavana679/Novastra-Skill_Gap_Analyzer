import mongoose from 'mongoose';
import Resume from '../models/Resume.js';

const getResumeById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid resume ID format'
            });
        }

        const resume = await Resume.findById(id);

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found'
            });
        }

        return res.status(200).json({
            success: true,
            resume: {
                fileName: resume.fileName,
                ocrText: resume.ocrText,
                createdAt: resume.createdAt,
                experienceLevel: resume.experienceLevel,
                targetRole: resume.targetRole,
                version: resume.version,
                isActive: resume.isActive
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Error fetching the resume'
        });
    }
};

const getResumes = async (req, res) => {
    try {
        const resumes = await Resume.find().sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            resumes
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Error fetching resumes'
        });
    }
};

export { getResumeById, getResumes };
