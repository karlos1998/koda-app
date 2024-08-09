import {Airport} from "./Airport.interface";

export interface Flight {
    departure_airport: Airport;
    arrival_airport: Airport;
    duration: number;
    airplane: string;
    airline: string;
    airline_logo: string;
    travel_class: string;
    flight_number: string;
    legroom: string;
    extensions: string[];
    often_delayed_by_over_30_min?: boolean;
}