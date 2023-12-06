import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Slide from './pages/Slide';

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/slide/:slideId" component={Slide} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
