import {PriceInsights} from "./PriceInsights.interface";
import {FlightOption} from "./FlightOption.interface";
import {SearchParameters} from "./SearchParameters.interface";
import {SearchMetadata} from "./SearchMetadata.interface";
import {FlightWithLayovers} from "./FlightWithLayovers.interface";

export interface SearchResult {
    search_metadata: SearchMetadata;
    search_parameters: SearchParameters;
    best_flights?: FlightOption[];
    other_flights?: (FlightOption | FlightWithLayovers)[];
    price_insights?: PriceInsights;

    error?: string;
}