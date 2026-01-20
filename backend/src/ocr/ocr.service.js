import { createRequire } from 'module';
import Tesseract from 'tesseract.js';

// Use createRequire for pdf-parse compatibility with ES Modules
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const normalizeText = (text) => {
    if (!text) return '';
    return text.replace(/\s+/g, ' ').trim();
};

const extractText = async (fileBuffer, mimetype) => {
    try {
        let extractedText = '';

        if (mimetype === 'application/pdf') {
            // Attempt to extract text from PDF using pdf-parse
            const data = await pdfParse(fileBuffer);
            extractedText = data.text;

            // Fallback to OCR if text extraction yields minimal results (scanned PDF)
            if (!extractedText || extractedText.trim().length < 20) {
                try {
                    const result = await Tesseract.recognize(fileBuffer, 'eng');
                    extractedText = result.data.text;
                } catch (ocrError) {
                    console.error('OCR fallback failed:', ocrError);
                }
            }

        } else if (mimetype.startsWith('image/')) {
            // Process image files (JPG, PNG) directly with Tesseract
            const result = await Tesseract.recognize(fileBuffer, 'eng');
            extractedText = result.data.text;
        }

        return normalizeText(extractedText);

    } catch (error) {
        console.error('OCR Service Error:', error);
        throw new Error('Could not process the file.');
    }
};

export default extractText;
