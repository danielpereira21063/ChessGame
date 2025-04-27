import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button    from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Card      from 'react-bootstrap/Card';

export default function HomeScreen() {
  const navigate = useNavigate();

  return (
    <Container className="d-flex vh-100 justify-content-center align-items-center">
      <Card bg="dark" text="light" className="p-4 shadow-lg">
        <Card.Body className="text-center">
          <Card.Title className="mb-4 fs-3">Welcome to React Chess</Card.Title>
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/game')}
          >
            Play with bot
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}
