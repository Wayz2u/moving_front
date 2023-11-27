import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Slide from './pages/Slide';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Slide />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
