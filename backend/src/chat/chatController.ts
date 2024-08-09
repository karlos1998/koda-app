import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import {AIService} from "../AI/AIService";
import {ChatService} from "./chatService";

export class ChatController {

    private chatService = new ChatService();
    public defineRoutes(socket: Socket<DefaultEventsMap, DefaultEventsMap>) {
        socket.on('chat message', async (msg) => this.chatService.receiveMessage(socket, msg));
    }
}
