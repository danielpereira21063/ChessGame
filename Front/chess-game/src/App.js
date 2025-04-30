import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomeScreen from './pages/HomeScreen';
import GamePage from './pages/GamePage';
import { Container } from 'react-bootstrap';
import AppNavbar from './components/navbar/AppNavbar';
import SelectBotPage from './pages/Bots/SelectBotPage';
import BotGamePage from './pages/Bots/Play';
import AnalysisPage from './pages/Analysis';

export default function App() {
  return (
    <>
      <AppNavbar />
      <br />
      <Container>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/bot" element={<SelectBotPage />} />
          <Route path="/bot/play" element={<BotGamePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </>
  );
}
