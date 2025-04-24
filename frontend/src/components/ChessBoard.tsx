import { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";

export const ChessBoard = ({ chess, board, socket, setBoard }: {
  chess: any;  
  setBoard: any;
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
}) => {
  const [from, setFrom] = useState<null | Square>(null);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  
  const handleSquareClick = (squareRepresentation: Square) => {
    if (!from) {
      setFrom(squareRepresentation);
      setSelectedSquare(squareRepresentation);
    } else {
      socket.send(JSON.stringify({
        type: MOVE,
        payload: {
          move: { 
            from,
            to: squareRepresentation
          } 
        }
      }));
      setFrom(null);
      setSelectedSquare(null);
      chess.move({
        from,
        to: squareRepresentation
      });
      setBoard(chess.board());
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="rounded-lg overflow-hidden shadow-2xl border-4 border-gray-800">
        {board.map((row, i) => {
          return (
            <div key={i} className="flex">
              {row.map((square, j) => {
                const squareRepresentation = String.fromCharCode(97 + (j % 8)) + "" + (8 - i) as Square;
                const isSelected = selectedSquare === squareRepresentation;
                const isPossibleDestination = from && chess.moves({ 
                  square: from, 
                  verbose: true 
                }).some((move: any) => move.to === squareRepresentation);
                
                return (
                  <div 
                    onClick={() => handleSquareClick(squareRepresentation)}
                    key={j} 
                    className={`w-16 h-16 transition-all duration-200 relative
                      ${(i+j)%2 === 0 ? 'bg-emerald-500' : 'bg-amber-50'}
                      ${isSelected ? 'ring-4 ring-blue-500 ring-inset z-10' : ''}
                      ${isPossibleDestination ? 'ring-4 ring-blue-300 ring-inset' : ''}
                      hover:brightness-110 cursor-pointer`}
                  >
                    {/* Coordinate labels */}
                    {j === 0 && (
                      <span className="absolute top-0 left-1 text-xs font-bold opacity-60">
                        {8 - i}
                      </span>
                    )}
                    {i === 7 && (
                      <span className="absolute bottom-0 right-1 text-xs font-bold opacity-60">
                        {String.fromCharCode(97 + j)}
                      </span>
                    )}
                    
                    <div className="w-full justify-center flex h-full items-center">
                      {square ? (
                        <img 
                          className="w-12 h-12 drop-shadow-md transition-transform hover:scale-110" 
                          src={`/${square?.color === "b" ? square?.type : `${square?.type?.toUpperCase()} copy`}.png`} 
                          alt={`${square?.color === "b" ? "Black" : "White"} ${square?.type}`}
                        />
                      ) : isPossibleDestination ? (
                        <div className="w-3 h-3 rounded-full bg-blue-500 opacity-70"></div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};