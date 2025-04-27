import React from 'react';
import { PieceIcon } from '../piece';
import { useChess } from './../../../contexts/ChessContext';

export default function Square({ square, playerTurn, inCheck }) {
  const { state, dispatch } = useChess();

  const key = square.piece ? `${square.piece.color}${square.piece.type}` : null;
  const Icon = key ? PieceIcon[key] : null;

  const isDark = (square.file + square.rank) % 2 === 0;
  const isMove = state.moves.some(m => m.file === square.file && m.rank === square.rank);
  const isSelect = state.selected &&
    state.selected.file === square.file &&
    state.selected.rank === square.rank;

  const handleClick = () => {
    if (!playerTurn) return;
    if (isMove) dispatch({ type: 'MOVE', dest: square });
    else dispatch({ type: 'SELECT', square });
  };

  return (
    <div
      className={`square
                  ${isDark ? 'square--dark' : 'square--light'}
                  ${isMove ? 'square--move' : ''}
                  ${isSelect ? 'square--selected' : ''}
                  ${inCheck ? 'square--check' : ''}`}
      onClick={handleClick}
    >
      {Icon && <Icon className="piece" />}
    </div>
  );
}