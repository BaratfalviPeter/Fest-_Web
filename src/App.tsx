import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import ColorVisualizer from './components/ColorVisualizer';
import Calculator from './calculator/Calculator';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ReferencesPage from './pages/ReferencesPage';

/** Főoldal – fókuszált és gyors; a Referenciák külön aloldalon él. */
function HomePage() {
  return (
    <main>
      <Hero />
      <Services />
      <About />
      <ColorVisualizer />
      <Calculator />
      <Contact />
    </main>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/referenciak" element={<ReferencesPage />} />
      </Routes>
      <Footer />
      {/* A sticky árkalkulátor sáv miatt a footer alá térköz, hogy ne takarja. */}
      <div className="h-20" aria-hidden="true" />
    </>
  );
}
