import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

// Piece component for draggable chess pieces
const Piece = ({ type, color }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'PIECE', // Define item type as PIECE
    item: { type, color },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move' }}>
      <img
        src={`/${color === 'b' ? type : `${type.toUpperCase()} copy`}.png`}
        alt={type}
        className='w-4'
      />
    </div>
  );
};

// Square component representing a square on the chessboard
const Square = ({ square, setFrom, socket, drop }) => {
  const [{ isOver }, dropRef] = useDrop({
    accept: 'PIECE', // Accept item type PIECE
    drop: (item, monitor) => {
      setFrom(square.coordinates); // Set 'from' coordinates on drop
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={(node) => drop(dropRef(node))}
      onClick={() => {
        if (!square.piece || square.piece.color !== 'b') return;
        setFrom(square.coordinates);
      }}
      className={`w-16 h-16 ${(square.coordinates.charCodeAt(0) + parseInt(square.coordinates.charAt(1))) % 2 === 0 ? 'bg-green-500' : 'bg-slate-500'}`}
      style={{
        backgroundColor: isOver ? 'yellow' : 'transparent',
      }}
    >
      {square.piece && (
        <Piece type={square.piece.type} color={square.piece.color} />
      )}
    </div>
  );
};

export default Square;
