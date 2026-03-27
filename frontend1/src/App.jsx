import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Landing } from './screens/Landing';
import { Game } from './screens/Game';
import { Toaster } from 'react-hot-toast';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend'; // Import HTML5Backend

function App() {
  return (
    <div className='h-screen bg-slate-950'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/game" element={<Game />} />
        </Routes>
       
          <Toaster position="top-center" />
       
      </BrowserRouter>
    </div>
  );
}

export default App;
