import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Gallery from './components/Gallery';
import Calculator from './calculator/Calculator';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <About />
        <Gallery />
        <Calculator />
        <Contact />
      </main>
      <Footer />
      {/* A sticky árkalkulátor sáv miatt a footer alá térköz, hogy ne takarja. */}
      <div className="h-20" aria-hidden="true" />
    </>
  );
}
