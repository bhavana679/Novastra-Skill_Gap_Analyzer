import Resume from '../models/Resume.js';
import extractText from '../ocr/ocr.service.js';

const uploadResume = async (req, res) => {
    try {
        // Check if a file was actually uploaded
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Process the file buffer to extract text
        const text = await extractText(req.file.buffer, req.file.mimetype);

        // Save the result to the MongoDB database
        const newResume = new Resume({
            fileName: req.file.originalname,
            ocrText: text,
        });

        await newResume.save();

        // Send the response back to the client
        res.status(200).json({
            message: 'Resume processed successfully',
            data: {
                id: newResume._id,
                fileName: newResume.fileName,
                extractedText: newResume.ocrText,
            },
        });

    } catch (error) {
        console.error('Controller Error:', error);
        res.status(500).json({ error: 'Failed to process resume' });
    }
};

export { uploadResume };
