// src/contexts/ChessContext.jsx
import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
} from 'react';
import { BoardGenerator, PieceColor, PieceType } from '../util/chess/boardFactory';
import { getLegalMoves } from '../util/chess/moveCalculator';

/* ———————————————————————————————  Context  —————————————————————————————— */
const ChessContext = createContext(null);
export const useChess = () => {
  const ctx = useContext(ChessContext);
  if (!ctx) throw new Error('useChess must be used within <ChessProvider>');
  return ctx;
};

/* ———————————————————————  Small helpers  ———————————————————————— */
const fileChar = f => String.fromCharCode(96 + f);       // 1 → 'a'
export const deepCopyBoard = board =>
  board.map(r =>
    r.map(sq => ({ ...sq, piece: sq.piece ? { ...sq.piece } : null }))
  );

/* ———————————————————————  Initial state  ———————————————————————— */
function initialState() {
  return {
    board: new BoardGenerator().generate(),
    selected: null,
    moves: [],
    history: [],
    turn: PieceColor.WHITE,
    enPassant: null,                                // {file, rank} or null
    castling: { wK: true, wQ: true, bK: true, bQ: true },
  };
}

/* ———————————————————————————  Reducer  ———————————————————————————— */
function reducer(state, action) {
  switch (action.type) {
    /* -------- SELECT -------------------------------------------------- */
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

    /* -------- MOVE ---------------------------------------------------- */
    case 'MOVE': {
      const { dest } = action;
      const board = deepCopyBoard(state.board);

      const srcSq  = board[8 - state.selected.rank][state.selected.file - 1];
      const destSq = board[8 - dest.rank][dest.file - 1];

      /* executa movimento */
      destSq.piece = srcSq.piece;
      srcSq.piece  = null;

      let enPassant = null;
      const castling = { ...state.castling };

      /* ——— roque ——— */
      if (destSq.piece.type === PieceType.KING) {
        if (state.turn === PieceColor.WHITE) { castling.wK = castling.wQ = false; }
        else                                  { castling.bK = castling.bQ = false; }

        if (Math.abs(dest.file - state.selected.file) === 2) {
          const rookSrcFile = dest.file === 7 ? 8 : 1;
          const rookDstFile = dest.file === 7 ? 6 : 4;
          const rank        = dest.rank;

          const rookSrc = board[8 - rank][rookSrcFile - 1];
          const rookDst = board[8 - rank][rookDstFile - 1];
          rookDst.piece = rookSrc.piece;
          rookSrc.piece = null;
        }
      }

      /* ——— torre mexeu → perde direito ——— */
      if (srcSq.piece?.type === PieceType.ROOK) {
        if (state.turn === PieceColor.WHITE) {
          if (srcSq.file === 1 && srcSq.rank === 1) castling.wQ = false;
          if (srcSq.file === 8 && srcSq.rank === 1) castling.wK = false;
        } else {
          if (srcSq.file === 1 && srcSq.rank === 8) castling.bQ = false;
          if (srcSq.file === 8 && srcSq.rank === 8) castling.bK = false;
        }
      }

      /* ——— en passant ——— */
      if (destSq.piece.type === PieceType.PAWN) {
        const dir = state.turn === PieceColor.WHITE ? 1 : -1;

        /* captura EP */
        if (dest.file !== state.selected.file &&
            !state.board[8 - dest.rank][dest.file - 1].piece) {
          const capSq = board[8 - (dest.rank - dir)][dest.file - 1];
          capSq.piece = null;
        }

        /* cria alvo EP se andou 2 */
        if (Math.abs(dest.rank - state.selected.rank) === 2) {
          enPassant = { file: dest.file, rank: dest.rank - dir };
        }
      }

      /* ——— notação simplificada ——— */
      const san =
        `${fileChar(state.selected.file)}${state.selected.rank}→` +
        `${fileChar(dest.file)}${dest.rank}`;

      return {
        board,
        selected: null,
        moves: [],
        history: [...state.history, { san, turn: state.turn }],
        turn: state.turn === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE,
        enPassant,
        castling,
      };
    }

    default:
      return state;
  }
}

/* ———————————————————————  Provider  ————————————————————————— */
export function ChessProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <ChessContext.Provider value={value}>{children}</ChessContext.Provider>;
}
