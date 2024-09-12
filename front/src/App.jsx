import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header'; 
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';


function App() {
  return (
  <div>
    <Header />
  
    <main>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </main>
  
    <Footer />
  </div>
  );
}

export default App;

