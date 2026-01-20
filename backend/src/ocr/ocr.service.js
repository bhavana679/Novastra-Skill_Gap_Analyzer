import { createRequire } from 'module';
import Tesseract from 'tesseract.js';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const normalizeText = (text) => {
    return text.replace(/\s+/g, ' ').trim();
};

const extractText = async (fileBuffer, mimetype) => {
    try {
        let extractedText = '';

        if (mimetype === 'application/pdf') {
            const data = await pdfParse(fileBuffer);
            extractedText = data.text;

            if (!extractedText || extractedText.trim().length === 0) {
                throw new Error('Scanned PDF not supported.');
            }

        } else if (mimetype.startsWith('image/')) {
            const result = await Tesseract.recognize(fileBuffer, 'eng');
            extractedText = result.data.text;
        }

        return normalizeText(extractedText);
    } catch (error) {
        console.error('OCR Error:', error);
        throw new Error('Failed to extract text from file');
    }
};

export default extractText;
