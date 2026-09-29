import { ADVANTAGES } from '../data/content';
import { SITE } from '../data/site';

const ABOUT_IMAGE =
  'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80';

export default function About() {
  return (
    <section id="rolunk" className="bg-gray-50 py-20 lg:py-28">
      <div className="section-container grid items-center gap-12 lg:grid-cols-2">
        {/* Kép */}
        <div className="relative">
          <img
            src={ABOUT_IMAGE}
            alt={`Tapasztalt szobafestő mester munka közben ${SITE.town} területén`}
            className="aspect-[4/3] w-full rounded-2xl object-cover shadow-xl"
          />
          <div className="absolute -bottom-6 -right-6 hidden rounded-2xl bg-primary px-8 py-6 text-white shadow-lg sm:block">
            <span className="block text-4xl font-extrabold">{SITE.yearsExperience}+</span>
            <span className="text-sm font-medium opacity-90">év tapasztalat</span>
          </div>
        </div>

        {/* Szöveg */}
        <div>
          <span className="text-sm font-bold uppercase tracking-wider text-accent">Rólunk</span>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Megbízható szakmunka, amire évek óta számíthat
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-600">
            {SITE.yearsExperience} év szakmai tapasztalattal állunk a {SITE.town} és környéki
            ügyfeleink rendelkezésére. Számunkra a minőség nem opció, hanem alapelvárás – ezt
            garanciával is alátámasztjuk.
          </p>

          <div className="mt-8 space-y-6">
            {ADVANTAGES.map((adv) => {
              const Icon = adv.icon;
              return (
                <div key={adv.title} className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{adv.title}</h3>
                    <p className="mt-1 text-gray-600">{adv.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
