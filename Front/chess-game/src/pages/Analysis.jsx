import React from 'react';
import { ChessProvider, useChess } from '../contexts/ChessContext';
import { Row, Col }                from 'react-bootstrap';
import { PieceColor }              from '../util/chess/boardFactory';
import ChessBoard                  from '../components/chess/board/ChessBoard';
import GameInfoCard                from '../components/chess/info/GameInfoCard';

function Analysis() {
  const { state } = useChess();

  return (
    <Row className="justify-content-between">
      <Col md={8}>
        {/* 
          playerColor = state.turn faz com que playerTurn seja sempre true
          para o lado que está de mover, liberando seleção/movimento 
        */}
        <ChessBoard
          orientation="white"
          playerColor={state.turn}
        />
      </Col>
      <Col xs={12} md={4} className="mt-3 mt-md-0">
        <GameInfoCard />
      </Col>
    </Row>
  );
}

export default function AnalysisPage() {
  return (
    <ChessProvider>
      <Analysis />
    </ChessProvider>
  );
}
