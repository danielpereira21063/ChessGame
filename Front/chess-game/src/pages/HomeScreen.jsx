// src/pages/HomeScreen.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Row, Col, Image } from 'react-bootstrap';

export default function HomeScreen() {
  const navigate = useNavigate();

  const user = { name: 'DanielSanches2022', avatar: null };

  return (
    <Row className="justify-content-center mt-5">
      <Col xs={11} sm={8} md={6} lg={4}>
        <Card
          text="light"
          className="shadow-lg px-4 py-4"
          style={{ minWidth: 400, maxWidth: 420 }}
        >
          <div className="d-flex flex-row mb-4">
            <Image
              src={user.avatar ?? 'https://danielsanchesdev.com.br/src/imagens/foto-perfil_02.png'}
              roundedCircle
              width={50}
              height={50}
              alt="profile"
              className="mb-3"
            />
            <h4 className="d-flex align-items-center">&nbsp;{user.name}</h4>
          </div>

          <Button data-bs-toggle="dropdown" aria-expanded="false"
            variant="secondary"
            size="lg"
            onClick={() => navigate('/bot')}>
            Jogar contra bot
          </Button>
          <Button className='mt-1' data-bs-toggle="dropdown" aria-expanded="false"
            variant="secondary"
            size="lg"
            onClick={() => navigate('/analysis')}>
            Análise
          </Button>
        </Card>
      </Col>
    </Row>
  );
}
