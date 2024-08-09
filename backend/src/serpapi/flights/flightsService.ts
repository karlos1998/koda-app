import {SearchResult} from "./interfaces/SearchResult.interface";

export class FlightsService {
    public formatBestFlights = (flights: SearchResult): string => {
        if(!flights.best_flights) return 'Brak dopasowanych lotów';

        return flights.best_flights.map(flightOption => {
            const flight = flightOption.flights[0];
            return `Numer lotu: ${flight.flight_number}
                Wylot: ${flight.departure_airport.name} (${flight.departure_airport.id}) o ${flight.departure_airport.time}
                Przylot: ${flight.arrival_airport.name} (${flight.arrival_airport.id}) o ${flight.arrival_airport.time}
                Czas trwania: ${flight.duration} minut
                Samolot: ${flight.airplane}
                Linia lotnicza: ${flight.airline}
                Klasa podróży: ${flight.travel_class}
                Cena: ${flightOption.price} USD
                -------------------------------`;
            }).join('\n\n');
    }
}