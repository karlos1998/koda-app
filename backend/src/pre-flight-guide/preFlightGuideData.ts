import path from "path";
import fs from "fs";

export class PreFlightGuideData {
    private static instance: PreFlightGuideData;
    private static guideSections: { [key: string]: string } = {};

    private filePath = path.join(__dirname, '../../storage', 'pre-fly-guide.json');
    private constructor() {}

    public static getInstance(): PreFlightGuideData {
        if (!PreFlightGuideData.instance) {
            PreFlightGuideData.instance = new PreFlightGuideData();
        }
        return PreFlightGuideData.instance;
    }

    public setGuideSections(sections: { [key: string]: string }) {
        PreFlightGuideData.guideSections = sections;
        const dir = path.join(__dirname, '../../storage');
        const filePath = path.join(dir, 'pre-fly-guide.json');

        fs.writeFile(filePath, JSON.stringify(sections), (err) => {
            if (err) {
                console.error('Wystąpił błąd podczas zapisywania pliku:', err);
                return;
            }
            console.log('Plik został zapisany pomyślnie w katalogu "storage"!');
        });
    }

    public getGuideSections() {
        return PreFlightGuideData.guideSections;
    }

    async loadData() {
        PreFlightGuideData.guideSections = JSON.parse(await fs.promises.readFile(this.filePath, 'utf-8'))
    }

    getDataKeys() {
        return Object.keys(this.getGuideSections());
    }

    hasKey(key: string) {
        return this.getDataKeys().indexOf(key) > -1;
    }

    getKeyData(key: string) {
        return this.getGuideSections()[key];
    }
}

export default PreFlightGuideData;
