import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import PreFlightGuideData from './preFlightGuideData';

export class PreFlightGuideScraper {
    public async run() {
        try {
            const browser = await puppeteer.launch({
                headless: false
            });
            const page = await browser.newPage();
            await page.goto('https://airport.wroclaw.pl/pasazer/odlatuje/poradnik-przed-odlotem/', {
                waitUntil: 'networkidle2',
            });

            const content = await page.content(); // Pobiera cały HTML strony

            // Sprawdzam, czy cheerio jest poprawnie załadowane
            if (!cheerio || typeof cheerio.load !== 'function') {
                throw new Error("Cheerio is not loaded correctly");
            }

            const $ = cheerio.load(content); // Poprawne użycie cheerio do załadowania zawartości strony

            const guideSections: { [key: string]: string } = {};

            $('.guide_for_passengers__button').each((i, element) => {
                const sectionName = $(element).data('text')?.trim();
                const sectionDataName = $(element).data('name')?.trim();
                const sectionContent = $(`.guide_for_passengers__text.${sectionDataName}`).html()?.trim();

                if (sectionName && sectionContent) {
                    guideSections[sectionName] = sectionContent;
                }
            });

            const guideData = PreFlightGuideData.getInstance();
            guideData.setGuideSections(guideSections);

            await browser.close(); // Zamknij przeglądarkę po zakończeniu pracy

            return guideSections;
        } catch (error) {
            console.error('Error fetching content:', error);
            return null;
        }
    }
}
