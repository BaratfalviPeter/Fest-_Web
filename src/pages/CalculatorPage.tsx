import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calculator as CalcIcon } from 'lucide-react';
import Calculator from '../calculator/Calculator';

export default function CalculatorPage() {
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
            Azonnali kalkuláció
          </span>
          <h1 className="mt-2 flex items-center justify-center gap-3 text-4xl font-extrabold sm:text-5xl">
            <CalcIcon className="h-9 w-9" />
            Árkalkulátor
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85">
            Adja hozzá a festendő szobákat, állítsa be a méreteket és a paramétereket, és azonnal
            láthatja a várható költséget.
          </p>
        </div>
      </section>

      {/* A kalkulátor komponens */}
      <Calculator />

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
    </main>
  );
}
