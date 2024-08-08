import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import * as dotenv from 'dotenv';
import {AIService} from "./AI/AIService";
dotenv.config();

const app = express();
const port = 3000;

const httpServer = createServer(app);

const aiService = new AIService();

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

  socket.on('chat message', async (msg) => {
    console.log('Message received: ', msg);

    await aiService.findFlyDataInMessage(msg);

    socket.emit("chat message", {
      sender: 'you',
      text: msg,
    })

    socket.emit("chat message", {
      sender: 'engine',
      text: 'Witaj, już Ci mówię...',
    })
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

httpServer.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
