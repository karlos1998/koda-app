import {Socket} from "socket.io";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {AIService} from "../AI/AIService";
import {SocketService} from "../socket/socketService";
import {SerpapiService} from "../serpapi/serpapiService";

export class ChatService {

    private aiService = new AIService();
    private serpapiService = new SerpapiService;

    public async receiveMessage(socket: Socket<DefaultEventsMap, DefaultEventsMap>, msg: string) {
        console.log('Message received: ', msg);

        const socketService = new SocketService(socket);

        socketService.sendMessage(msg);

        socketService.sendMessage('Zobaczmy co da się zrobić...');

        const flyData = await this.aiService.findFlyDataInMessage(msg);

        if(!flyData.departureCity) {
            socketService.sendMessage('W Twojej prośbie brakuje przede wszystkim miejsca wylotu. Powiedz skąd chcesz wylecieć - miasto, kraj. Potrzebne oczywiście też mi będzie miejsce w które chesz się udać i odpowiadający Ci termin');
            return;
        } else if(!flyData.arrivalCity) {
            socketService.sendMessage('Napisz proszę jeszcze raz - skąd, ale i dokąd chcesz lecieć. Nie zapomnij podać też daty podróży');
            return
        } else if(!flyData.date) {
            socketService.sendMessage('Brakuje jeszcze daty - kiedy chciałbyś wylecieć?');
            return;
        }

        socketService.sendMessage(`Dobrze, poszukajmy odpowiednich lotów:\nMiejsce odlotu: ${flyData.departureCity}\nCel podróży: ${flyData.arrivalCity}\n Data: ${flyData.date}`);

        const flights = await this.serpapiService.getFlights();
        console.log(flights);
    }
}