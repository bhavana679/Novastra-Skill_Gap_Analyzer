import Tesseract from 'tesseract.js';
import { PDFParse } from 'pdf-parse';

const normalizeText = (text) => {
    if (!text) return '';
    return text.replace(/\s+/g, ' ').trim();
};

const extractText = async (fileBuffer, mimetype) => {
    try {
        let extractedText = '';

        if (mimetype === 'application/pdf') {
            // Attempt to extract text from PDF using pdf-parse v2.x
            const parser = new PDFParse({ data: fileBuffer });
            const data = await parser.getText();
            extractedText = data.text;
            await parser.destroy();

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
        throw new Error(error.message || 'Could not process the file.');
    }
};

export default extractText;
