// src/pages/SelectBotPage.jsx
import React from 'react';
import { Card, Button, Row, Col, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const levels = [
  { id: 'easy',    label: 'Fácil',   color: 'success',  desc: 'Lances aleatórios' },
  { id: 'medium',  label: 'Médio',   color: 'warning',  desc: 'Minimax nível 2'   },
  { id: 'hard',    label: 'Difícil', color: 'danger',   desc: 'Motor forte'       },
];

export default function SelectBotPage() {
  const nav = useNavigate();

  return (
    <Container className="my-5">
      <h2 className="text-center text-light mb-4">Escolha a dificuldade</h2>

      <Row className="g-4 justify-content-center">
        {levels.map(lvl => (
          <Col xs={11} sm={6} md={4} lg={3} key={lvl.id}>
            <Card bg="dark" text="light" className="h-100 shadow-sm">
              <Card.Body className="d-flex flex-column align-items-center gap-3">
                <h4 className={`text-${lvl.color}`}>{lvl.label}</h4>
                <p className="text-muted text-center small flex-grow-1">{lvl.desc}</p>
                <Button
                  variant={lvl.color}
                  onClick={() => nav(`/bot/play?difficulty=${lvl.id}`)}
                >
                  Jogar
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
