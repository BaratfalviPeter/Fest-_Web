import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import ColorVisualizer from './components/ColorVisualizer';
import CtaSection from './components/CtaSection';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ReferencesPage from './pages/ReferencesPage';
import CalculatorPage from './pages/CalculatorPage';

/**
 * Főoldal – fókuszált bemutatkozó: érték először. A Referenciák és az
 * Árkalkulátor külön aloldalon él; a CTA szekció vezet át rájuk.
 */
function HomePage() {
  return (
    <main>
      <Hero />
      <Services />
      <About />
      <ColorVisualizer />
      <CtaSection />
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
        <Route path="/arkalkulator" element={<CalculatorPage />} />
      </Routes>
      <Footer />
    </>
  );
}
