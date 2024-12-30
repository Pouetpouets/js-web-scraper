import puppeteer from 'puppeteer';
import { createObjectCsvWriter } from 'csv-writer';
import { logger } from './utils/logger.js';
import { config } from './config.js';

export class Scraper {
    constructor() {
        this.browser = null;
        this.page = null;
    }

    async init() {
        try {
            this.browser = await puppeteer.launch({
                headless: "new",
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            this.page = await this.browser.newPage();
            
            // Set default navigation timeout
            this.page.setDefaultNavigationTimeout(config.timeout);
            
            // Enable request interception for better performance
            await this.page.setRequestInterception(true);
            
            // Only allow necessary resources
            this.page.on('request', (request) => {
                if (['image', 'stylesheet', 'font'].includes(request.resourceType())) {
                    request.abort();
                } else {
                    request.continue();
                }
            });

            logger.info('Browser initialized successfully');
        } catch (error) {
            logger.error('Failed to initialize browser:', error);
            throw error;
        }
    }

    async navigate(url) {
        try {
            await this.page.goto(url, { waitUntil: 'networkidle0' });
            logger.info(`Navigated to ${url}`);
        } catch (error) {
            logger.error(`Failed to navigate to ${url}:`, error);
            throw error;
        }
    }

    async extractData(selectors) {
        try {
            const data = await this.page.evaluate((selectors) => {
                const results = {};
                for (const [key, selector] of Object.entries(selectors)) {
                    const element = document.querySelector(selector);
                    results[key] = element ? element.textContent.trim() : null;
                }
                return results;
            }, selectors);
            
            logger.info('Data extracted successfully');
            return data;
        } catch (error) {
            logger.error('Failed to extract data:', error);
            throw error;
        }
    }

    async saveToCSV(data, filename) {
        const csvWriter = createObjectCsvWriter({
            path: filename,
            header: Object.keys(data[0]).map(key => ({ id: key, title: key }))
        });

        try {
            await csvWriter.writeRecords(data);
            logger.info(`Data saved to ${filename}`);
        } catch (error) {
            logger.error('Failed to save data:', error);
            throw error;
        }
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
            logger.info('Browser closed');
        }
    }
}