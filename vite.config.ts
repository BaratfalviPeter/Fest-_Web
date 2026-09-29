import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages a repó nevű alkönyvtár alól szolgálja ki az oldalt,
  // ezért az asset útvonalakat ehhez az elérési úthoz kell igazítani.
  // Egyedi domain (CNAME) esetén állítsd vissza '/'-re.
  base: '/Fest-_Web/',
});
