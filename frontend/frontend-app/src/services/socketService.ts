import { io, Socket } from "socket.io-client";

class SocketService {
    private socket: Socket | null = null;

    connect(): void {
        this.socket = io("http://localhost:3000"); // Upewnij się, że ten adres pasuje do Twojego serwera

        this.socket.on("connect", () => {
            console.log("Connected to Socket.io server");
        });

        this.socket.on("disconnect", () => {
            console.log("Disconnected from Socket.io server");
        });
    }

    sendMessage(message: string): void {
        if (this.socket) {
            this.socket.emit("chat message", message);
        }
    }

    onMessage(callback: (message: { username: string; text: string }) => void): void {
        if (this.socket) {
            this.socket.on("chat message", callback);
        }
    }
}

export default new SocketService();
