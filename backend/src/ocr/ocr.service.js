import Tesseract from 'tesseract.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
// Standard pdf-parse usually exports a function
const pdfParse = require('pdf-parse');

const normalizeText = (text) => {
    if (!text) return '';
    // Preserve line structure for accurate extraction. Just trim whitespace from ends.
    return text.trim();
};

const extractText = async (fileBuffer, mimetype) => {
    try {
        let extractedText = '';
        if (mimetype === 'application/pdf') {
            try {
                const data = await pdfParse(fileBuffer);
                extractedText = data.text || '';
            } catch (pdfError) {
                console.error('pdf-parse failed:', pdfError.message);
            }

            if (!extractedText || extractedText.trim().length === 0) {
                console.warn('PDF parsing returned empty text. This might be a scanned PDF or image which is not supported in this mode.');
            }

        } else if (mimetype.startsWith('image/')) {
            try {
                const result = await Tesseract.recognize(fileBuffer, 'eng');
                extractedText = result.data.text || '';
            } catch (tessError) {
                console.error('Tesseract failed on image:', tessError);
                throw new Error('Failed to extract text from image.');
            }
        } else {
            console.warn(`Unsupported mimetype: ${mimetype}`);
        }

        const finalResult = normalizeText(extractedText);
        return finalResult;

    } catch (error) {
        console.error('Global OCR Service Error:', error);
        throw new Error(`OCR Processing Failed: ${error.message}`);
    }
};

export default extractText;
