import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Slide from './pages/Slide';
import Sheet from './pages/Sheet';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/slide" element={<Slide />} />
        <Route path="/sheet" element={<Sheet />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
