import React, { useState } from "react";
import { MOVE } from "../screens/Game";
import toast from 'react-hot-toast';

export const ChessBoard = ({ chess, board, socket, setBoard, playerColor, playClicked }) => {
    const moveSound = new Audio('/sound.mp3');
    const isBlackPlayer = playerColor === 'black';
    const [draggedPiece, setDraggedPiece] = useState(null);

    const handleDragStart = (e, from) => {
        e.dataTransfer.setData('from', from);
        setDraggedPiece(from);
    };

    const handleDrop = (e, to) => {
        if (!playClicked) {
            toast.error('Please click on Play button to start the game.');
            return;
        }

        const from = e.dataTransfer.getData('from');

        socket.send(JSON.stringify({
            type: MOVE,
            payload: {
                move: {
                    from,
                    to
                }
            }
        }));

        const move = chess.move({ from, to });

        if (!move) {
            toast.error('Invalid move');
        } else {
            moveSound.play();
            setBoard(chess.board());
            console.log({ from, to });
        }

        setDraggedPiece(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div className={`text-white ${isBlackPlayer ? 'rotate-180' : ''} chessboard`}>
            {board.map((row, i) => (
                <div key={i} className={`flex ${isBlackPlayer ? 'flex-row-reverse' : ''}`}>
                    {row.map((square, j) => {
                        const squareRepresentation = String.fromCharCode(97 + (j % 8)) + "" + (8 - i);

                        return (
                            <div
                                key={j}
                                className={`square ${(i + j) % 2 === 0 ? 'bg-green-500' : 'bg-slate-500'}`}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, squareRepresentation)}
                            >
                                <div className={`piece-container ${isBlackPlayer ? 'rotate-180' : ''}`}>
                                    {square ? (
                                        <img
                                            className="piece"
                                            src={`/${square.color === "b" ? square.type : `${square.type.toUpperCase()} copy`}.png`}
                                            alt={`${square.type}`}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, squareRepresentation)}
                                        />
                                    ) : null}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};
