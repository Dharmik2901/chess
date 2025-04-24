"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        // Send game initialization to both players
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: 'white'
            }
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: 'black'
            }
        }));
    }
    makeMove(socket, move) {
        // Check if it's the player's turn
        const isWhiteTurn = this.board.turn() === 'w';
        const currentPlayer = isWhiteTurn ? this.player1 : this.player2;
        // Validate that the correct player is making the move
        if (socket !== currentPlayer) {
            socket.send(JSON.stringify({
                type: 'ERROR',
                message: 'Not your turn'
            }));
            return;
        }
        try {
            // Make the move on the chess board
            const result = this.board.move(move);
            if (!result) {
                socket.send(JSON.stringify({
                    type: 'ERROR',
                    message: 'Invalid move'
                }));
                return;
            }
            // Broadcast the move to both players
            const moveNotification = JSON.stringify({
                type: messages_1.MOVE,
                payload: {
                    from: move.from,
                    to: move.to,
                    promotion: move.promotion,
                    fen: this.board.fen()
                }
            });
            this.player1.send(moveNotification);
            this.player2.send(moveNotification);
            // Check if the game is over
            if (this.board.isGameOver()) {
                let reason = '';
                let winner = null;
                if (this.board.isCheckmate()) {
                    reason = 'checkmate';
                    // The player who just moved won
                    winner = isWhiteTurn ? 'black' : 'white';
                }
                else if (this.board.isDraw()) {
                    reason = 'draw';
                    if (this.board.isStalemate()) {
                        reason = 'stalemate';
                    }
                    else if (this.board.isThreefoldRepetition()) {
                        reason = 'threefold repetition';
                    }
                    else if (this.board.isInsufficientMaterial()) {
                        reason = 'insufficient material';
                    }
                    else if (this.board.isDraw()) {
                        reason = '50-move rule';
                    }
                }
                const gameOverMessage = JSON.stringify({
                    type: messages_1.GAME_OVER,
                    payload: {
                        winner,
                        reason
                    }
                });
                // Fixed: .emit() method doesn't exist on WebSocket, use .send() instead
                this.player1.send(gameOverMessage);
                this.player2.send(gameOverMessage);
            }
        }
        catch (e) {
            console.error('Error making move:', e);
            socket.send(JSON.stringify({
                type: 'ERROR',
                message: 'Invalid move'
            }));
        }
    }
    // Add method to get game state
    getGameState() {
        return {
            fen: this.board.fen(),
            turn: this.board.turn(),
            isCheck: this.board.isCheck(),
            isGameOver: this.board.isGameOver(),
            startTime: this.startTime
        };
    }
}
exports.Game = Game;
