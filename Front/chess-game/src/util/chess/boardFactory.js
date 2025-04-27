export const PieceColor = Object.freeze({ WHITE: 'w', BLACK: 'b' });
export const PieceType  = Object.freeze({
  PAWN: 'p', ROOK: 'r', KNIGHT: 'n', BISHOP: 'b', QUEEN: 'q', KING: 'k',
});

export function makePiece(type, color) {
  return { type, color };
}

export class BoardGenerator {
  constructor(startingFenProvider = () => BoardGenerator.DEFAULT_FEN) {
    this._startingFenProvider = startingFenProvider;
  }

  generate() {
    const fen = this._startingFenProvider();
    return this.#fenToBoardArray(fen);
  }

  /* ---------- implementation details ---------- */

  #fenToBoardArray(fen) {
    const [piecePlacement] = fen.split(' ');
    const ranks = piecePlacement.split('/');
    if (ranks.length !== 8) throw new Error('FEN inválida');

    return ranks.map((rankString, rankIdx) => {
      const rank    = 8 - rankIdx;
      const squares = [];
      let file      = 0;

      for (const char of rankString) {
        // ----- CASAS VAZIAS -----
        if (/^\d$/.test(char)) {
          const empty = Number(char);
          for (let i = 0; i < empty; i++) {
            squares.push({ file: ++file, rank, piece: null });
          }
          continue;
        }

        // ----- PEÇAS -----
        const color = char === char.toUpperCase() ? PieceColor.WHITE : PieceColor.BLACK;
        const type  = char.toLowerCase();

        squares.push({
          file: ++file,
          rank,
          piece: makePiece(type, color),
        });
      }

      return squares; // já tem sempre 8 casas após o loop
    });
  }

  static DEFAULT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
}
