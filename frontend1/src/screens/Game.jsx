

import React, { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { ChessBoard } from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { Chess } from 'chess.js';
import toast from 'react-hot-toast';

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

export const Game = () => {
    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());
    const [started, setStarted] = useState(false);
    const [playClicked, setPlayClicked] = useState(false);
    const [playerColor, setPlayerColor] = useState(null);
    const [capturedPieces, setCapturedPieces] = useState({ white: [], black: [] });
    const [movesHistory, setMovesHistory] = useState([]);

    useEffect(() => {
        if (!socket) {
            return;
        }
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            switch (message.type) {
                case INIT_GAME:
                    setBoard(chess.board());
                    setStarted(true);
                    setPlayerColor(message.payload.color);
                    toast.success('Game is started');
                    break;
                case MOVE:
                    const move = message.payload;
                    const capturedPiece = chess.get(move.to);
                    if (capturedPiece) {
                        const color = capturedPiece.color === 'w' ? 'white' : 'black';
                        setCapturedPieces(prev => ({
                            ...prev,
                            [color]: [...prev[color], capturedPiece.type]
                        }));
                    }
                    chess.move(move);
                    setBoard(chess.board());
                    setMovesHistory(prev => [...prev, move]);
                    console.log("Move made");
                    break;
                case GAME_OVER:
                    console.log("Game over");
                    break;
                default:
                    break;
            }
        };
    }, [socket]);

    const handlePlay = () => {
        if (playClicked) {
            toast.error('You have already clicked Play.');
            return;
        }

        socket.send(JSON.stringify({ type: INIT_GAME }));
        toast('Waiting for another player to join.');
        setPlayClicked(true);
    };

    if (!socket) return <div>Connecting...</div>;

    return (
        <div className="justify-center flex">
            <div className="pt-8 max-w-screen-lg w-full">
                <div className="grid grid-cols-6 gap-4 w-full">
                    <div className="col-span-4 w-full flex justify-center">
                        <ChessBoard
                            chess={chess}
                            setBoard={setBoard}
                            socket={socket}
                            board={board}
                            playerColor={playerColor}
                            capturedPieces={capturedPieces}
                            playClicked={playClicked}  // Pass the playClicked state
                        />
                    </div>
                    <div className="col-span-2 bg-slate-900 w-full flex flex-col p-4">
                        <div>
                            {!started && (
                                <Button onClick={handlePlay} disabled={playClicked}>
                                    Play
                                </Button>
                            )}
                        </div>
                        <div className="pt-4">
                            <div>
                                <h3 className="text-white mb-2">Captured Pieces</h3>
                                <div className="flex flex-col items-center overflow-y-auto max-h-48">
                                    {Object.entries(capturedPieces).map(([color, pieces], index) => (
                                        <div key={index} className="flex">
                                            {pieces.map((piece, idx) => (
                                                <img
                                                    key={idx}
                                                    className={`piece ${color === 'white' ? 'white-piece' : 'black-piece'}`}
                                                    src={`/${color === 'white' ? piece.toLowerCase() : `${piece.toUpperCase()} copy`}.png`}
                                                    alt={piece}
                                                />
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="pt-4">
                                <h3 className="text-white mb-2">Moves History</h3>
                                <div className="flex flex-col items-center overflow-y-auto max-h-48">
                                    {movesHistory.map((move, index) => (
                                        <div key={index} className="flex text-white">
                                            <span>{index + 1}.</span>
                                            <span className="ml-2">{move.from} to {move.to}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

