import { Scraper } from './scraper.js';
import { logger } from './utils/logger.js';

async function main() {
    const scraper = new Scraper();
    
    try {
        await scraper.init();
        
        // Example usage
        await scraper.navigate('https://example.com');
        
        const data = await scraper.extractData({
            title: 'h1',
            description: 'p'
        });
        
        await scraper.saveToCSV([data], 'output.csv');
        
    } catch (error) {
        logger.error('Main process failed:', error);
    } finally {
        await scraper.close();
    }
}

main();