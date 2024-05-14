import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WaitingRoom from './pages/WaitingRoom';
import GameRoom from './pages/GameRoom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WaitingRoom />} />
        <Route path="/gameroom" element={<GameRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
