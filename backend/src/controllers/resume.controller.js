import Resume from '../models/Resume.js';
import extractText from '../ocr/ocr.service.js';
import { cleanText } from '../services/textCleaner.service.js';

const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Extract raw text using OCR
        const rawText = await extractText(req.file.buffer, req.file.mimetype);

        // Clean and normalize the extracted text
        const cleanedText = cleanText(rawText);

        // Save the cleaned text to MongoDB
        const savedResume = await Resume.create({
            fileName: req.file.originalname,
            ocrText: cleanedText,
            createdAt: new Date()
        });

        return res.status(200).json({
            success: true,
            resumeId: savedResume._id,
            text: cleanedText
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Error processing the resume file'
        });
    }
};

export { uploadResume };
