import { useEffect, useState } from "react";
import { Button } from "../components/Button"
import { ChessBoard } from "../components/ChessBoard"
import { useSocket } from "../hooks/useSocket"
import { Chess } from "chess.js"

// ToDo: Move together, there's code repetition here
export const INIT_GAME="init_game";
export const MOVE="move";
export const GAME_OVER="game_over";

export const Game = () => {
    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board()); 
    const [started, setStarted] = useState(false);
    const [status, setStatus] = useState<string>("");
    const [_connecting, setConnecting] = useState(true);
    
    useEffect(() => {
        if(!socket) {
            return;
        }
        
        setConnecting(false);
        
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            
            switch (message.type) {
              case INIT_GAME:
                setChess(new Chess());
                setBoard(chess.board());
                setStarted(true);
                setStatus("Game started!");
                break;
              case MOVE:
                const move = message.payload;
                chess.move(move);
                setBoard(chess.board());
                setStatus(chess.turn() === 'w' ? "White Team" : "Black Team");
                break;
              case GAME_OVER:
                const winner = message.payload.winner;
                setStatus(`Game over! ${winner === 'white' ? 'White' : 'Black'} wins!`);
                break;
              case "WAITING":
                setStatus("Waiting for opponent to join...");
                break;
            }
          };
    }, [socket, chess]);
    
    if (!socket) return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-blue-900">
        <div className="bg-white bg-opacity-10 p-8 rounded-xl backdrop-blur-sm shadow-xl">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white text-xl font-medium">Connecting to server...</p>
          </div>
        </div>
      </div>
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-blue-900 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8">Chess Game</h1>
          
          <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm rounded-xl shadow-2xl p-6 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
              <div className="lg:col-span-4 flex justify-center"> 
                <ChessBoard 
                  chess={chess} 
                  setBoard={setBoard} 
                  socket={socket}
                  board={board}
                />
              </div>
              
              <div className="lg:col-span-2 flex flex-col justify-start items-center p-4 space-y-6">
                <div className="w-full bg-gray-700 bg-opacity-50 rounded-lg p-4 shadow-inner">
                  <h2 className="text-xl font-semibold mb-2">Game Status</h2>
                  <p className="text-lg">{status || "Ready to play"}</p>
                </div>
                
                {!started && (
                  <Button onClick={() => {
                    socket.send(JSON.stringify({
                      type: INIT_GAME
                    }));
                    setStatus("Finding opponent...");
                  }}>
                    Play Now
                  </Button>
                )}
                
                {started && (
                  <div className="w-full bg-gray-700 bg-opacity-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-2">Move History</h3>
                    <div className="h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500">
                      {chess.history().map((move, index) => (
                        <div key={index} className="py-1 border-b border-gray-600">
                          {Math.floor(index/2) + 1}. {index % 2 === 0 ? move : `... ${move}`}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};
