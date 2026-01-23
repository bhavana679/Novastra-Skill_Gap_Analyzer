export const cleanText = (text) => {
    if (!text || typeof text !== 'string') {
        return '';
    }

    let cleaned = text;

    cleaned = cleaned.replace(/\r\n/g, '\n');
    cleaned = cleaned.replace(/--\s*\d+\s*of\s*\d+\s*--/gi, '');
    cleaned = cleaned.replace(/Page\s*\d+\s*of\s*\d+/gi, '');
    cleaned = cleaned.replace(/[ \t]+/g, ' ');
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

    return cleaned.trim();
};

export default cleanText;
