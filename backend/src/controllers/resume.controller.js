import Resume from '../models/Resume.js';
import extractText from '../ocr/ocr.service.js';

const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No file uploaded' });
        }

        const text = await extractText(req.file.buffer, req.file.mimetype);

        const newResume = new Resume({
            fileName: req.file.originalname,
            ocrText: text,
        });

        await newResume.save();

        res.status(200).json({
            success: true,
            text: text,
        });

    } catch (error) {
        console.error('Upload Controller Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to process resume.',
        });
    }
};

export { uploadResume };
