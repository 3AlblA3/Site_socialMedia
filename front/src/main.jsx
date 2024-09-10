import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'; //Quand on importe plusieurs fonction du même fichier, agencer comme ceci
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import './assets/App.css'

 
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Header />
    <App />
    <Footer />
  </React.StrictMode>,
)

