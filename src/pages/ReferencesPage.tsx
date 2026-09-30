import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { GALLERY, BEFORE_AFTER } from '../data/content';
import { SITE } from '../data/site';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import LightboxGallery from '../components/LightboxGallery';
import FunnelCta from '../components/FunnelCta';

export default function ReferencesPage() {
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
            Portfólió
          </span>
          <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">Referenciák</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85">
            Elkészült munkáink {SITE.town} és környékéről. Húzza el az előtte-utána csúszkát, és
            nézze meg nagyban a galéria fotóit!
          </p>
        </div>
      </section>

      <div className="section-container py-16 lg:py-20">
        {/* Előtte-utána csúszka */}
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-center text-2xl font-extrabold text-gray-900 sm:text-3xl">
            Előtte / Utána
          </h2>
          <BeforeAfterSlider
            beforeSrc={BEFORE_AFTER.beforeSrc}
            beforeAlt={BEFORE_AFTER.beforeAlt}
            afterSrc={BEFORE_AFTER.afterSrc}
            afterAlt={BEFORE_AFTER.afterAlt}
          />
          <p className="mt-4 text-center text-sm text-gray-500">
            Mozgassa a csúszkát a festés előtti és utáni állapot összehasonlításához.
          </p>
        </div>

        {/* Galéria rács + lightbox */}
        <div className="mt-20">
          <h2 className="mb-8 text-center text-2xl font-extrabold text-gray-900 sm:text-3xl">
            Elkészült munkáink
          </h2>
          <LightboxGallery images={GALLERY} />
        </div>

        {/* Vissza a főoldalra */}
        <div className="mt-16 border-t border-gray-100 pt-10 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-semibold text-primary hover:text-primary-dark"
          >
            <ArrowLeft className="h-5 w-5" />
            Vissza a főoldalra
          </Link>
        </div>
      </div>

      {/* Sales funnel: tovább a Színtervezőhöz */}
      <FunnelCta
        title="Inspirálódott? Tervezze meg saját falait a Színtervezővel!"
        buttonLabel="Irány a Színtervező"
        to="/szintervezo"
      />
    </main>
  );
}
