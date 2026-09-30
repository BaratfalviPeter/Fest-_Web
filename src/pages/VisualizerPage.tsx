import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Palette } from 'lucide-react';
import ColorVisualizer from '../components/ColorVisualizer';
import FunnelCta from '../components/FunnelCta';

export default function VisualizerPage() {
  // Aloldalra lépéskor görgessünk a tetejére.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main>
      {/* Fejléc-sáv (sötét háttér, hogy a fix Header szövege olvasható legyen) */}
      <section className="bg-primary-dark pt-28 pb-16 text-white lg:pt-36">
        <div className="section-container text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-accent-light">
            Próbálja ki online
          </span>
          <h1 className="mt-2 flex items-center justify-center gap-3 text-4xl font-extrabold sm:text-5xl">
            <Palette className="h-9 w-9" />
            Színtervező
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85">
            Válasszon teret, márkát és színt – és nézze meg azonnal, hogyan mutatna otthonában.
          </p>
        </div>
      </section>

      {/* A színtervező komponens */}
      <ColorVisualizer />

      {/* Vissza a főoldalra */}
      <div className="section-container py-10 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-semibold text-primary hover:text-primary-dark"
        >
          <ArrowLeft className="h-5 w-5" />
          Vissza a főoldalra
        </Link>
      </div>

      {/* Sales funnel: tovább az Árkalkulátorhoz */}
      <FunnelCta
        title="Megvan az álomszín? Számolja ki a várható költségeket!"
        buttonLabel="Irány az Árkalkulátor"
        to="/arkalkulator"
      />
    </main>
  );
}
