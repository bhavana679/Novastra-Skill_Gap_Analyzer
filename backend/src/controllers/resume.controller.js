import Resume from '../models/Resume.js';
import extractText from '../ocr/ocr.service.js';
import { cleanText } from '../services/textCleaner.service.js';
import { extractSkills } from '../services/skillExtractor.service.js';

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

        const savedResume = await Resume.create({
            fileName: req.file.originalname,
            ocrText: cleanedText,
            skills,
            education,
            experienceLevel,
            createdAt: new Date()
        });

        return res.status(200).json({
            success: true,
            resumeId: savedResume._id,
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

export { uploadResume };
