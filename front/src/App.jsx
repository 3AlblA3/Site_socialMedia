import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './Header'; // Assure-toi que le chemin est correct
import Footer from './Footer'; // Assure-toi que le chemin est correct
import HomePage from './HomePage';
import Login from './Login';
import Signup from './Signup';


function App() {
  return (
  <div>
    <Header />
  
    <main>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        {/* Ajoute d'autres routes ici si nécessaire */}
      </Routes>
    </main>
  
    <Footer />
  </div>
  );
}

export default App;