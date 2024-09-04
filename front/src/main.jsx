import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Footer, Header } from './App.jsx'
import { GetPosts } from './index.css'

createRoot(document.getElementById('header')).render(
  <StrictMode>
    <Header />
  </StrictMode>,
)

createRoot(document.getElementById('main')).render(
  <StrictMode>
    <GetPosts />
  </StrictMode>
)

createRoot(document.getElementById('footer')).render(
  <StrictMode>
    <Footer />
  </StrictMode>,
)


