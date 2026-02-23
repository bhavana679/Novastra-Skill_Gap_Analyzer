import dotenv from 'dotenv';

dotenv.config();

export const config = {
    PORT: process.env.PORT || 5001,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET || 'your_secret_key_change_me',
    AI_PROVIDER: process.env.AI_PROVIDER || 'gemini',
    AI_API_KEY: process.env.AI_API_KEY || '',
    GROQ_API_KEY: process.env.GROQ_API_KEY || '',
    ATS_SERVICE_API_KEY: process.env.ATS_SERVICE_API_KEY || ''
};

export default config;
