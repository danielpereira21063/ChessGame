import React from 'react';
import { isKingInCheck } from '../../../util/chess/moveCalculator';
import { PieceColor } from '../../../util/chess/boardFactory';
import Square from './Square';
import './css/Board.css';
import './css/Square.css';
import { useChess } from './../../../contexts/ChessContext';

/**
 * @param {('white'|'black')} orientation - lado do jogador (brancas = padrão)
 * @param {('w'|'b')} playerColor         - cor que o humano controla
 */
export default function ChessBoard({ orientation = 'white', playerColor }) {
  const { state } = useChess();
  const playerTurn = state.turn === playerColor;

  /* 1 ▸ cheques */
  const whiteInCheck = isKingInCheck(state.board, PieceColor.WHITE);
  const blackInCheck = isKingInCheck(state.board, PieceColor.BLACK);

  /* 2 ▸ inverter ranks/files quando joga de pretas */
  const ranks = orientation === 'white'
    ? state.board
    : [...state.board].reverse();

  return (
    <div className="board">
      {ranks.map(rank => {
        const files = orientation === 'white' ? rank : [...rank].reverse();

        return files.map(square => {
          const inCheck =
            (whiteInCheck && square.piece?.type === 'k' && square.piece.color === PieceColor.WHITE) ||
            (blackInCheck && square.piece?.type === 'k' && square.piece.color === PieceColor.BLACK);

          return (
            <Square
              key={`${square.file}${square.rank}`}
              square={square}
              playerTurn={playerTurn}
              inCheck={inCheck}
            />
          );
        });
      })}
    </div>
  );
}
