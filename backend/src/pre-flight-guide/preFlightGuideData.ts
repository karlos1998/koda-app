export class PreFlightGuideData {
    private static instance: PreFlightGuideData;
    private guideSections: { [key: string]: string } | null = null;

    private constructor() {}

    public static getInstance(): PreFlightGuideData {
        if (!PreFlightGuideData.instance) {
            PreFlightGuideData.instance = new PreFlightGuideData();
        }
        return PreFlightGuideData.instance;
    }

    public setGuideSections(sections: { [key: string]: string }) {
        this.guideSections = sections;
    }

    public getGuideSections() {
        return this.guideSections;
    }
}

export default PreFlightGuideData;
