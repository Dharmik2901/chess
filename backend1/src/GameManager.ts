import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./messages";
import { Game } from "./Game";

export class GameManager {
  private games: Game[];
  private pendingUser: WebSocket | null;
  private users: WebSocket[];

  constructor() {
    this.games = [];
    this.pendingUser = null;
    this.users = [];
  }

  addUser(socket: WebSocket) {
    this.users.push(socket);
    this.addHandler(socket);
  }

  // Fix: Instead of throwing an error, implement the handler
  addHandler(socket: WebSocket) {
    // Call our message handler method
    this.handleMessage(socket);
  }

  removeUser(socket: WebSocket) {
    this.users = this.users.filter(user => user !== socket);
    // stop the game if the user lefts
    
    // Find and remove any games this user was part of
    const gameIndex = this.games.findIndex(
      game => game.player1 === socket || game.player2 === socket
    );
    
    if (gameIndex !== -1) {
      this.games.splice(gameIndex, 1);
    }
    
    // Clear pending user if that was the one who left
    if (this.pendingUser === socket) {
      this.pendingUser = null;
    }
  }

  // Fix: Changed from "handleMassage" to "handleMessage"
  private handleMessage(socket: WebSocket) {
    socket.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === INIT_GAME) {
          if (this.pendingUser) {
            if (this.pendingUser !== socket) {
              const game = new Game(this.pendingUser, socket);
              this.games.push(game);
              this.pendingUser = null;
            }
          } else {
            this.pendingUser = socket;
            socket.send(JSON.stringify({
              type: "WAITING",
              message: "Waiting for an opponent"
            }));
          }
        }

        if (message.type === MOVE) {
          const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
          if (game) {
            game.makeMove(socket, message.payload.move);
          }
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    });
  }
}