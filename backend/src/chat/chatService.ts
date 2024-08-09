import {Socket} from "socket.io";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {AIService} from "../AI/AIService";

export class ChatService {

    private aiService = new AIService();
    public async receiveMessage(socket: Socket<DefaultEventsMap, DefaultEventsMap>, msg: string) {
        console.log('Message received: ', msg);

        socket.emit("chat message", {
            sender: 'you',
            text: msg,
        })

        socket.emit("chat message", {
            sender: 'engine',
            text: 'Zobaczmy co da się zrobić...',
        })

        const flyData = await this.aiService.findFlyDataInMessage(msg);

        socket.emit("chat message", {
            sender: 'engine',
            text: JSON.stringify(flyData),
        })
    }
}