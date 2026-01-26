import dotenv from 'dotenv';

dotenv.config();

export const config = {
    PORT: process.env.PORT || 5001,
    MONGO_URI: process.env.MONGO_URI,
    AI_PROVIDER: process.env.AI_PROVIDER || 'openai',
    AI_API_KEY: process.env.AI_API_KEY || ''
};

export default config;
