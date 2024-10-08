import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { AIService } from "../AI/AIService";
import { SocketService } from "../socket/socketService";
import { SerpapiService } from "../serpapi/serpapiService";
import { FlightsService } from "../serpapi/flights/flightsService";
import preFlightGuideData from "../pre-flight-guide/preFlightGuideData";

export class ChatService {

    private aiService = new AIService();
    private serpapiService = new SerpapiService();
    private flightsService = new FlightsService();

    public async receiveMessage(socket: Socket<DefaultEventsMap, DefaultEventsMap>, msg: string) {
        console.log('Message received: ', msg);

        const socketService = new SocketService(socket);

        // socketService.sendMessage('Zobaczmy co da się zrobić...');
        //
        const preFlightInfo = await this.aiService.findPreFlightInfoInMessage(msg);

        if(preFlightInfo.topic && preFlightGuideData.getInstance().hasKey(preFlightInfo.topic)) {
            socketService.sendMessage(preFlightGuideData.getInstance().getKeyData(preFlightInfo.topic));
        } else {
            const flyData = await this.aiService.findFlyDataInMessage(msg);
            if (flyData.departureCity && flyData.arrivalCity && flyData.date) {
                socketService.sendMessage(`Dobrze, poszukajmy odpowiednich lotów:\nMiejsce odlotu: ${flyData.departureCity}\nCel podróży: ${flyData.arrivalCity}\n Data: ${flyData.date}`);
                try {
                    const flights = await this.serpapiService.getFlights(flyData);
                    socketService.sendMessage(this.flightsService.formatBestFlights(flights));
                } catch {
                    socketService.sendMessage('Niestety, nie udało się wyszukać lotu w tych kryteriach');
                }
            } else {
                socketService.sendMessage('Proszę, sprecyzuj swoje zapytanie.');
            }
        }
    }
}
