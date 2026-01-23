import mongoose from 'mongoose';
import Resume from '../models/Resume.js';

const getResumeById = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the provided ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid resume ID format'
            });
        }

        // Search for the resume in the database
        const resume = await Resume.findById(id);

        // If no resume is found with that ID
        if (!resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found'
            });
        }

        // Return the resume details
        return res.status(200).json({
            success: true,
            resume: {
                fileName: resume.fileName,
                ocrText: resume.ocrText,
                createdAt: resume.createdAt
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Error fetching the resume'
        });
    }
};

export { getResumeById };
