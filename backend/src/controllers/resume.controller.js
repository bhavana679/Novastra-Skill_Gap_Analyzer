import Resume from '../models/Resume.js';
import extractText from '../ocr/ocr.service.js';

const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const extractedText = await extractText(req.file.buffer, req.file.mimetype);

        const savedResume = await Resume.create({
            fileName: req.file.originalname,
            ocrText: extractedText,
            createdAt: new Date()
        });

        return res.status(200).json({
            success: true,
            resumeId: savedResume._id,
            text: extractedText
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Error processing the resume file'
        });
    }
};

export { uploadResume };
