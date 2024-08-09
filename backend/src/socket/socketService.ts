import {Socket} from "socket.io";
import {DefaultEventsMap} from "socket.io/dist/typed-events";

export class SocketService {

    private socket: Socket<DefaultEventsMap, DefaultEventsMap>;
    constructor(socket: Socket<DefaultEventsMap, DefaultEventsMap>) {
        this.socket = socket;
    }

    sendMessage(text: string) {
        this.socket.emit("chat message", {
            sender: 'engine',
            text,
        })
    }
}