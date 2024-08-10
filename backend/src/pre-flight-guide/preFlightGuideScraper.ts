import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import PreFlightGuideData from './preFlightGuideData';
import {AIService} from "../AI/AIService";
import {stripHtml} from "../utils/stripHtml";
import * as fs from 'fs';
import * as path from 'path';

export class PreFlightGuideScraper {

    private aiService = new AIService();
    public async run() {
        try {
            const browser = await puppeteer.launch({
                headless: false
            });
            const page = await browser.newPage();
            await page.goto('https://airport.wroclaw.pl/pasazer/odlatuje/poradnik-przed-odlotem/', {
                waitUntil: 'networkidle2',
            });

            const content = await page.content();

            if (!cheerio || typeof cheerio.load !== 'function') {
                throw new Error("Cheerio is not loaded correctly");
            }

            const $ = cheerio.load(content);

            const guideSections: { [key: string]: string } = {};

            $('.guide_for_passengers__button').each((i, element) => {
                const sectionName = $(element).data('text')?.trim();
                const sectionDataName = $(element).data('name')?.trim();
                const sectionContent = $(`.guide_for_passengers__text.${sectionDataName}`).html()?.trim();

                if (sectionName && sectionContent) {
                    guideSections[sectionName] = sectionContent;
                }
            });

            console.log('Pobieranie danych z poradnika przed odlotem....')

            const jsonData: {[key: string]: string} = {};

            for(const key of Object.keys(guideSections)) {
                console.log('Pobieranie informacji zakładki: ' + key);
                const val = stripHtml( guideSections[key] ).slice(0, 4000);
                const response = await this.aiService.convertPreFlightInfo(JSON.stringify({
                    [key]: val,
                }));

                jsonData[response.key] = response.description;
            }

            console.log('zapisywanie danych.');

            const guideData = PreFlightGuideData.getInstance();
            guideData.setGuideSections(jsonData);

            await browser.close();

            return guideSections;
        } catch (error) {
            console.error('Error fetching content:', error);
            return null;
        }
    }
}
