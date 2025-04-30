// src/contexts/ChessContext.jsx
import React, { createContext, useContext, useReducer, useMemo } from 'react';
import { Chess } from 'chess.js';
import { BoardGenerator, PieceColor, PieceType } from '../util/chess/boardFactory';
import { getLegalMoves } from '../util/chess/moveCalculator';

/* ————————————————————————— Context ————————————————————————— */
const ChessContext = createContext(null);
export const useChess = () => {
  const ctx = useContext(ChessContext);
  if (!ctx) throw new Error('useChess must be used within <ChessProvider>');
  return ctx;
};

/* ——————————————————— Helpers para MOVE ————————————————————— */

/**
 * Gera a notação SAN via chess.js, tratando promoção de peão.
 */
function calculateSan(engine, selected, dest) {
  const from = `${String.fromCharCode(96 + selected.file)}${selected.rank}`;
  const to   = `${String.fromCharCode(96 + dest.file)}${dest.rank}`;
  if (
    selected.piece.type === PieceType.PAWN &&
    (dest.rank === 8 || dest.rank === 1)
  ) {
    return engine.move({ from, to, promotion: 'q' })?.san;
  }
  return engine.move({ from, to })?.san;
}

/**
 * Clona profundamente o board para não mutar o estado original.
 */
function cloneBoard(board) {
  return board.map(row => row.map(sq => ({
    ...sq,
    piece: sq.piece ? { ...sq.piece } : null
  })));
}

/**
 * Move a peça no board clonado e retorna srcSq e destSq.
 */
function applyBoardMove(board, selected, dest) {
  const srcSq  = board[8 - selected.rank][selected.file - 1];
  const destSq = board[8 - dest.rank][dest.file - 1];
  destSq.piece = srcSq.piece;
  srcSq.piece  = null;
  return { srcSq, destSq };
}

/**
 * Atualiza direitos de roque e move torre em caso de roque.
 */
function processCastling(castling, turn, selected, dest, board) {
  const rights = { ...castling };
  // Rei se moveu
  if (selected.piece.type === PieceType.KING) {
    if (turn === PieceColor.WHITE) rights.wK = rights.wQ = false;
    else                            rights.bK = rights.bQ = false;
    // Detecta roque
    if (Math.abs(dest.file - selected.file) === 2) {
      const rookSrcFile = dest.file === 7 ? 8 : 1;
      const rookDstFile = dest.file === 7 ? 6 : 4;
      const rank        = dest.rank;
      const rookSrc = board[8 - rank][rookSrcFile - 1];
      const rookDst = board[8 - rank][rookDstFile - 1];
      rookDst.piece = rookSrc.piece;
      rookSrc.piece = null;
    }
  }
  // Torre se moveu
  if (selected.piece.type === PieceType.ROOK) {
    const { file, rank } = selected;
    if (turn === PieceColor.WHITE) {
      if (file === 1 && rank === 1) rights.wQ = false;
      if (file === 8 && rank === 1) rights.wK = false;
    } else {
      if (file === 1 && rank === 8) rights.bQ = false;
      if (file === 8 && rank === 8) rights.bK = false;
    }
  }
  return rights;
}

/**
 * Trata captura en passant e define o próximo enPassant.
 */
function processEnPassant(state, selected, dest, newBoard) {
  let enPassant = null;
  if (selected.piece.type === PieceType.PAWN) {
    const dir = state.turn === PieceColor.WHITE ? 1 : -1;
    // Captura fantasma
    if (
      dest.file !== selected.file &&
      !state.board[8 - dest.rank][dest.file - 1].piece
    ) {
      const capSq = newBoard[8 - (dest.rank - dir)][dest.file - 1];
      capSq.piece = null;
    }
    // Marca en passant se andou 2 casas
    if (Math.abs(dest.rank - selected.rank) === 2) {
      enPassant = { file: dest.file, rank: dest.rank - dir };
    }
  }
  return enPassant;
}

/* —————————————————————— Estado Inicial —————————————————————— */
function initialState() {
  const engine = new Chess();
  return {
    engine,
    board: new BoardGenerator(() => engine.fen()).generate(),
    selected: null,
    moves: [],
    history: [],
    turn: PieceColor.WHITE,
    enPassant: null,
    castling: { wK: true, wQ: true, bK: true, bQ: true },
  };
}

/* —————————————————————————— Reducer —————————————————————————— */
function reducer(state, action) {
  switch (action.type) {
    case 'SELECT': {
      const { square, movesOverride } = action;
      if (!square.piece || square.piece.color !== state.turn) return state;
      const moves = movesOverride ??
        getLegalMoves(state.board, square, {
          enPassant: state.enPassant,
          castling:  state.castling,
        });
      return { ...state, selected: square, moves };
    }

    case 'MOVE': {
      const { dest } = action;
      const engine   = state.engine;
      const turn     = state.turn;

      // 1) Gera SAN
      const san = calculateSan(engine, state.selected, dest) ||
        `${String.fromCharCode(96 + state.selected.file)}${state.selected.rank}→` +
        `${String.fromCharCode(96 + dest.file)}${dest.rank}`;

      // 2) Atualiza board
      const newBoard = cloneBoard(state.board);
      const { srcSq, destSq } = applyBoardMove(newBoard, state.selected, dest);

      // 3) Roque
      const castling = processCastling(state.castling, turn, state.selected, dest, newBoard);
      // 4) En passant
      const enPassant = processEnPassant(state, state.selected, dest, newBoard);

      // 5) Retorna novo estado
      return {
        engine,
        board: newBoard,
        selected: null,
        moves: [],
        history: [...state.history, { san, turn }],
        turn: turn === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE,
        enPassant,
        castling,
      };
    }

    default:
      return state;
  }
}

/* ————————————————————— Provider ————————————————————— */
export function ChessProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <ChessContext.Provider value={value}>{children}</ChessContext.Provider>;
}
