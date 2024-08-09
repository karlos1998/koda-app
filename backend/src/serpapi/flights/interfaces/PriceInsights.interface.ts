export interface PriceInsights {
    lowest_price: number;
    price_level: string;
    typical_price_range: [number, number];
    price_history: [number, number][];
}