import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// A router basename a Vite base URL-jéből (pl. "/Fest-_Web/"), záró perjel nélkül.
// Így a tiszta útvonalak (pl. /referenciak) helyesen működnek GitHub Pages
// alkönyvtáras kiszolgálásán is.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
