import { Link } from 'react-router-dom';
import { Images, Palette, Calculator, ArrowRight, type LucideIcon } from 'lucide-react';

interface CtaCard {
  icon: LucideIcon;
  title: string;
  description: string;
  to: string;
  cta: string;
  isRoute: boolean;
}

const CARDS: CtaCard[] = [
  {
    icon: Images,
    title: 'Referenciák',
    description: 'Nézze meg elkészült munkáinkat és az előtte-utána átalakulásokat.',
    to: '/referenciak',
    cta: 'Referenciák megtekintése',
    isRoute: true,
  },
  {
    icon: Palette,
    title: 'Színtervező',
    description: 'Tervezze meg otthona falait – próbálja ki a színeket élőben, online.',
    to: '#szintervezo',
    cta: 'Falak megtervezése',
    isRoute: false,
  },
  {
    icon: Calculator,
    title: 'Árkalkulátor',
    description: 'Számolja ki pár kattintással a festés várható költségét.',
    to: '/arkalkulator',
    cta: 'Költség kiszámítása',
    isRoute: true,
  },
];

export default function CtaSection() {
  const scrollToSection = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="bg-gray-50 py-20 lg:py-28">
      <div className="section-container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-accent">
            Hogyan tovább?
          </span>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Fedezze fel, mit kínálunk
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Nézze meg referenciáinkat, tervezze meg a színeket, vagy számolja ki a várható
            költséget – néhány kattintással.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {CARDS.map((card) => {
            const Icon = card.icon;
            const inner = (
              <>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-white transition-colors group-hover:bg-accent">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-gray-900">{card.title}</h3>
                <p className="mt-2 flex-1 leading-relaxed text-gray-600">{card.description}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-semibold text-primary group-hover:text-accent">
                  {card.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </>
            );

            const cardClass =
              'group flex flex-col rounded-2xl border border-gray-100 bg-white p-8 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl';

            return card.isRoute ? (
              <Link key={card.title} to={card.to} className={cardClass}>
                {inner}
              </Link>
            ) : (
              <button
                key={card.title}
                type="button"
                onClick={() => scrollToSection(card.to.slice(1))}
                className={cardClass}
              >
                {inner}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
