import {Layover} from "./Layover.interface";
import {FlightOption} from "./FlightOption.interface";

export interface FlightWithLayovers extends FlightOption {
    layovers?: Layover[];
}
