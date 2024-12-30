import dotenv from 'dotenv';
dotenv.config();

export const config = {
    timeout: parseInt(process.env.TIMEOUT) || 30000,
    headless: process.env.HEADLESS !== 'false',
    userDataDir: process.env.USER_DATA_DIR || './user-data',
    outputDir: process.env.OUTPUT_DIR || './data',
    retries: parseInt(process.env.RETRIES) || 3,
    delay: parseInt(process.env.DELAY) || 1000
};