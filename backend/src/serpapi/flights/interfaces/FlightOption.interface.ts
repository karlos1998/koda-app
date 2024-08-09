import {Flight} from "./Flight.interface";
import {CarbonEmissions} from "./CarbonEmissions.interface";

export interface FlightOption {
    flights: Flight[];
    total_duration: number;
    carbon_emissions: CarbonEmissions;
    price: number;
    type: string;
    airline_logo: string;
    booking_token: string;
}