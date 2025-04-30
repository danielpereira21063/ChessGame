import { getLegalMoves } from '../util/chess/moveCalculator';

export default function EasyBot(state, dispatch) {
  const { board, turn, moves, selected, enPassant, castling } = state;

  if (!selected) {
    // gera lista [ { square, legalMoves } , … ]
    const candidates = board.flat()
      .filter(sq => sq.piece && sq.piece.color === turn)
      .map(sq => ({
        square: sq,
        legal: getLegalMoves(board, sq, { enPassant, castling }),
      }))
      .filter(entry => entry.legal.length);   // só peças com movimento

    if (!candidates.length) return; // xeque-mate / empate

    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    // faz SELECT e guarda os lances já calculados
    dispatch({ type: 'SELECT', square: pick.square, movesOverride: pick.legal });
    return; // aguarda próximo ciclo p/ realizar o lance
  }

  /* 2 ▸ peça já selecionada → mover */
  if (moves.length) {
    const dest = moves[Math.random() * moves.length | 0];
    dispatch({ type: 'MOVE', dest });
  }
}
