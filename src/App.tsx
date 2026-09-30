import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import CtaSection from './components/CtaSection';
import Contact from './components/Contact';
import FunnelCta from './components/FunnelCta';
import Footer from './components/Footer';
import ReferencesPage from './pages/ReferencesPage';
import VisualizerPage from './pages/VisualizerPage';
import CalculatorPage from './pages/CalculatorPage';

/**
 * Főoldal – fókuszált bemutatkozó: érték először. A Referenciák, a Színtervező
 * és az Árkalkulátor külön aloldalon él; a CTA szekció + a záró funnel CTA
 * vezet tovább az értékesítési tölcséren.
 */
function HomePage() {
  return (
    <main>
      <Hero />
      <Services />
      <About />
      <CtaSection />
      <Contact />
      <FunnelCta
        title="Kíváncsi a minőségünkre? Nézze meg korábbi munkáinkat!"
        buttonLabel="Referenciák megtekintése"
        to="/referenciak"
      />
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
        <Route path="/szintervezo" element={<VisualizerPage />} />
        <Route path="/arkalkulator" element={<CalculatorPage />} />
      </Routes>
      <Footer />
    </>
  );
}
