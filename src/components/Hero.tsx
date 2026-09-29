import { Calculator, CheckCircle2 } from 'lucide-react';
import { SITE } from '../data/site';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1920&q=80';

export default function Hero() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="fooldal" className="relative flex min-h-screen items-center">
      {/* Háttérkép + overlay */}
      <div className="absolute inset-0 -z-10">
        <img
          src={HERO_IMAGE}
          alt={`Prémium falfestés és szobafestés ${SITE.town} területén`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 via-primary/80 to-primary/40" />
      </div>

      <div className="section-container py-32 text-white">
        <div className="max-w-2xl animate-fade-in-up">
          <span className="mb-4 inline-block rounded-full bg-accent/90 px-4 py-1.5 text-sm font-semibold">
            {SITE.town} és {SITE.serviceRadiusKm} km-es vonzáskörzete
          </span>

          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            Prémium Szobafestés és Tapétázás {SITE.town} területén
          </h1>

          <p className="mt-6 text-lg text-white/90 sm:text-xl">
            Tiszta munkavégzés, minőségi anyagok és garancia. Számolja ki online, mennyibe kerül
            otthona megújítása – kötelezettség nélkül.
          </p>

          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-white/90">
            {['Ingyenes helyszíni felmérés', 'Garancia minden munkára', 'Fix, átlátható árak'].map(
              (item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent-light" />
                  {item}
                </li>
              ),
            )}
          </ul>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button onClick={() => scrollTo('kalkulator')} className="btn-accent text-lg">
              <Calculator className="h-5 w-5" />
              Irány az Árkalkulátor
            </button>
            <button
              onClick={() => scrollTo('szolgaltatasok')}
              className="rounded-lg border-2 border-white/70 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Szolgáltatásaink
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
