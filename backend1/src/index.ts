import { WebSocketServer, WebSocket } from 'ws';
import { GameManager } from './GameManager';

const port = Number(process.env.PORT) || 8080;
const wss = new WebSocketServer({ port });

const gameManager = new GameManager();

wss.on('connection', function connection(ws) {
  console.log('New client connected');
  gameManager.addUser(ws);
  
  // Fix: WebSocket doesn't have "disconnect" event, it uses "close" instead
  ws.on("close", () => {
    console.log('Client disconnected');
    gameManager.removeUser(ws);
  });
  
  // Add error handling
  ws.on("error", (error) => {
    console.error('WebSocket error:', error);
  });
  
  // Handle incoming messages
  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log('Received message:', data);
      // Process the message according to your game logic
      // Example: gameManager.handleMessage(ws, data);
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });
});

// Add server error handling
wss.on('error', (error) => {
  console.error('WebSocket server error:', error);
});

console.log(`WebSocket server started on port ${port}`);
