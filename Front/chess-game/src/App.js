import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import HomeScreen from './pages/HomeScreen';
import GamePage from './pages/GamePage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/game" element={<GamePage />} />

      {/* catch-all:  redireciona URLs desconhecidas p/ Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
