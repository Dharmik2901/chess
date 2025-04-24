import { Chess } from 'chess.js';
import { WebSocket } from 'ws';
import { GAME_OVER, INIT_GAME, MOVE } from './messages';

export class Game {
    public player1: WebSocket; // white player
    public player2: WebSocket; // black player
    public board: Chess;
    private startTime: Date; // Fixed typo: starTime -> startTime
    
    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
        
        // Send game initialization to both players
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: 'white'
            }
        }));
        
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: 'black'
            }
        }));
    }

    makeMove(socket: WebSocket, move: {
        from: string;
        to: string;
        promotion?: string; // Optional promotion piece
    }) {
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
                type: MOVE,
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
                } else if (this.board.isDraw()) {
                    reason = 'draw';
                    if (this.board.isStalemate()) {
                        reason = 'stalemate';
                    } else if (this.board.isThreefoldRepetition()) {
                        reason = 'threefold repetition';
                    } else if (this.board.isInsufficientMaterial()) {
                        reason = 'insufficient material';
                    } else if (this.board.isDraw()) {
                        reason = '50-move rule';
                    }
                }
                
                const gameOverMessage = JSON.stringify({
                    type: GAME_OVER,
                    payload: {
                        winner,
                        reason
                    }
                });
                
                // Fixed: .emit() method doesn't exist on WebSocket, use .send() instead
                this.player1.send(gameOverMessage);
                this.player2.send(gameOverMessage);
            }
        } catch (e) {
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