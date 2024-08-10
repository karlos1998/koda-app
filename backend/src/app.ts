import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import {ChatController} from "./chat/chatController";
import {PreFlightGuideScraper} from "./pre-flight-guide/preFlightGuideScraper";
import PreFlightGuideData from "./pre-flight-guide/preFlightGuideData";

const app = express();
const port = 3000;

(new PreFlightGuideScraper()).run().then(() => {
  console.log(PreFlightGuideData.getInstance().getGuideSections());
});

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.get('/health', (req: Request, res: Response) => {
  res.send({
    message: 'Health check - OK!',
  });
});

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  (new ChatController()).defineRoutes(socket);

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

httpServer.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
