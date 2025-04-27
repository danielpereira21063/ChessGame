// src/util/chess/moveCalculator.js
import { PieceColor, PieceType } from './boardFactory';

/* ─────────── util interno: cloneBoard (evita ciclo de import) ───────── */
const cloneBoard = board =>
  board.map(r =>
    r.map(sq => ({
      ...sq,
      piece: sq.piece ? { ...sq.piece } : null,
    }))
  );

/* ─────────── helper: verifica se casa é atacada ─────────── */
function isSquareAttacked(board, file, rank, byColor) {
  const inB = (f, r) => f >= 1 && f <= 8 && r >= 1 && r <= 8;
  const get = (f, r) => (inB(f, r) ? board[8 - r][f - 1].piece : null);

  /* peões */
  const pDir = byColor === PieceColor.WHITE ? 1 : -1;
  if ([-1, 1].some(df => {
    const p = get(file + df, rank - pDir);
    return p && p.color === byColor && p.type === PieceType.PAWN;
  })) return true;

  /* cavalos */
  const kD = [[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]];
  if (kD.some(([df,dr]) => {
    const p = get(file + df, rank + dr);
    return p && p.color === byColor && p.type === PieceType.KNIGHT;
  })) return true;

  /* bishop/queen diagonais */
  const scan = (dirs, types) => {
    for (const [df,dr] of dirs) {
      let f = file + df, r = rank + dr;
      while (inB(f, r)) {
        const p = get(f, r);
        if (!p) { f += df; r += dr; continue; }
        return p.color === byColor && types.includes(p.type);
      }
    }
    return false;
  };
  if (scan([[1,1],[-1,1],[1,-1],[-1,-1]], [PieceType.BISHOP, PieceType.QUEEN])) return true;
  if (scan([[1,0],[-1,0],[0,1],[0,-1]], [PieceType.ROOK,   PieceType.QUEEN])) return true;

  /* rei adjacente */
  for (let df=-1; df<=1; df++) for (let dr=-1; dr<=1; dr++) {
    if (!df && !dr) continue;
    const p = get(file + df, rank + dr);
    if (p && p.color === byColor && p.type === PieceType.KING) return true;
  }
  return false;
}

/* ─────────── helper: rei em cheque ─────────── */
function isKingInCheck(board, color) {
  let kFile = 0, kRank = 0;
  board.flat().forEach(sq => {
    if (sq.piece && sq.piece.color === color && sq.piece.type === PieceType.KING) {
      kFile = sq.file; kRank = sq.rank;
    }
  });
  const opp = color === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;
  return isSquareAttacked(board, kFile, kRank, opp);
}

/* ─────────── MAIN: getLegalMoves ─────────── */
export function getLegalMoves(board, square, extras = {}) {
  if (!square.piece) return [];

  const add = (f,r)=>({file:f,rank:r});
  const inB = (f,r)=>f>=1&&f<=8&&r>=1&&r<=8;
  const get = (f,r)=>board[8-r][f-1];
  const {type,color}=square.piece;
  const dir = color===PieceColor.WHITE?1:-1;
  let moves=[];

  /* ====== geração pseudolegal ====== */
  switch (type) {
    case PieceType.PAWN: {
      if (inB(square.file, square.rank + dir) &&
          !get(square.file, square.rank + dir).piece) {
        moves.push(add(square.file, square.rank + dir));
        const start = color === PieceColor.WHITE ? 2 : 7;
        if (square.rank === start &&
            !get(square.file, square.rank + dir * 2).piece) {
          moves.push(add(square.file, square.rank + dir * 2));
        }
      }
      [-1,1].forEach(df=>{
        const f=square.file+df, r=square.rank+dir;
        if(!inB(f,r))return;
        const tgt=get(f,r).piece;
        if(tgt&&tgt.color!==color)moves.push(add(f,r));
        const ep=extras.enPassant;
        if(ep&&ep.file===f&&ep.rank===r)moves.push(add(f,r));
      });
      break;
    }
    case PieceType.KNIGHT: {
      const d=[[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]];
      d.forEach(([df,dr])=>{
        const f=square.file+df,r=square.rank+dr;
        if(inB(f,r)&&(!get(f,r).piece||get(f,r).piece.color!==color))
          moves.push(add(f,r));
      });
      break;
    }
    case PieceType.BISHOP:
    case PieceType.ROOK:
    case PieceType.QUEEN: {
      const dirs=[];
      if(type!==PieceType.BISHOP)dirs.push([1,0],[-1,0],[0,1],[0,-1]);
      if(type!==PieceType.ROOK)  dirs.push([1,1],[-1,1],[1,-1],[-1,-1]);
      dirs.forEach(([df,dr])=>{
        let f=square.file+df,r=square.rank+dr;
        while(inB(f,r)){
          const p=get(f,r).piece;
          if(!p)moves.push(add(f,r));
          else{if(p.color!==color)moves.push(add(f,r));break;}
          f+=df;r+=dr;
        }
      });
      break;
    }
    case PieceType.KING: {
      for(let df=-1;df<=1;df++)for(let dr=-1;dr<=1;dr++){
        if(!df&&!dr)continue;
        const f=square.file+df,r=square.rank+dr;
        if(inB(f,r)&&(!get(f,r).piece||get(f,r).piece.color!==color))
          moves.push(add(f,r));
      }
      const rights=extras.castling;
      const y=color===PieceColor.WHITE?1:8;
      const empty=f=>inB(f,y)&&!get(f,y).piece;
      if(color===PieceColor.WHITE&&rights?.wK&&empty(6)&&empty(7))moves.push(add(7,1));
      if(color===PieceColor.WHITE&&rights?.wQ&&empty(4)&&empty(3)&&empty(2))moves.push(add(3,1));
      if(color===PieceColor.BLACK&&rights?.bK&&empty(6)&&empty(7))moves.push(add(7,8));
      if(color===PieceColor.BLACK&&rights?.bQ&&empty(4)&&empty(3)&&empty(2))moves.push(add(3,8));
      break;
    }
    default: break;
  }

  /* ====== filtro de cheque ====== */
  const legal=[];
  for(const m of moves){
    const sim=cloneBoard(board);
    const src=sim[8-square.rank][square.file-1];
    const dst=sim[8-m.rank][m.file-1];
    dst.piece=src.piece; src.piece=null;
    if(type===PieceType.PAWN&&m.file!==square.file&&!dst.piece){
      const capRank=m.rank-dir;
      sim[8-capRank][m.file-1].piece=null;
    }
    if(!isKingInCheck(sim,color))legal.push(m);
  }
  return legal;
}

/* exporta p/ UI */
export { isKingInCheck };
