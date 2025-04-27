// src/components/info/GameInfoCard.jsx
import React from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { useChess } from '../../../contexts/ChessContext';
import { PieceColor } from '../../../util/chess/boardFactory';
import './css/./GameInfoCard.css';

export default function GameInfoCard() {
  const { state } = useChess();

  const turnText =
    state.turn === PieceColor.WHITE ? 'White to move' : 'Black to move';

  const lastMove =
    state.history.length > 0
      ? state.history[state.history.length - 1].san
      : '—';

  return (
    <Card className="game-info-card shadow-sm">
      <Card.Header as="h5">Game&nbsp;Info</Card.Header>

      <ListGroup variant="flush">
        <ListGroup.Item><strong>Turn:</strong> {turnText}</ListGroup.Item>
        <ListGroup.Item><strong>Last move:</strong> {lastMove}</ListGroup.Item>
        <ListGroup.Item><strong>Total moves:</strong> {state.history.length}</ListGroup.Item>
      </ListGroup>

      <Card.Body className="p-0">
        <div className="history-scroll">
          <ListGroup variant="flush">
            {state.history.map((m, idx) => (
              <ListGroup.Item key={idx}>
                <span className="text-muted">{idx + 1}.</span> {m.san}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      </Card.Body>
    </Card>
  );
}
