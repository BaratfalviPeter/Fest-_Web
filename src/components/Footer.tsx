import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Paintbrush, Phone, Mail, MapPin } from 'lucide-react';
import { NAV_ITEMS, SITE } from '../data/site';

// Jogi PDF-ek a public/docs mappából (Vite base URL-lel a Pages-elérésért).
const ASZF_PDF = `${import.meta.env.BASE_URL}docs/aszf.pdf`;
const PRIVACY_PDF = `${import.meta.env.BASE_URL}docs/adatkezelesi-tajekoztato.pdf`;

export default function Footer() {
  const year = new Date().getFullYear();
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === '/';

  // Szekció-hivatkozás (#id): a főoldalon görgetés, máshonnan előbb navigálás.
  const goToSection = (id: string) => {
    if (onHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    }
  };

  return (
    <footer className="bg-primary-dark text-white/80">
      <div className="section-container py-14">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Márka */}
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-primary">
                <Paintbrush className="h-6 w-6" />
              </span>
              <span className="text-lg font-extrabold text-white">{SITE.companyName}</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed">
              Prémium szobafestés, tapétázás és glettelés {SITE.town} és {SITE.serviceRadiusKm}{' '}
              km-es vonzáskörzetében. Tiszta munkavégzés, garanciával.
            </p>
          </div>

          {/* Navigáció */}
          <div>
            <h3 className="font-bold text-white">Oldaltérkép</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  {item.href.startsWith('/') ? (
                    <Link to={item.href} className="transition-colors hover:text-white">
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => goToSection(item.href.slice(1))}
                      className="text-left transition-colors hover:text-white"
                    >
                      {item.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Elérhetőség */}
          <div>
            <h3 className="font-bold text-white">Elérhetőség</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-accent-light" />
                <a href={SITE.phoneHref} className="hover:text-white">
                  {SITE.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-accent-light" />
                <a href={SITE.emailHref} className="hover:text-white">
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent-light" />
                {SITE.town} és környéke
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 border-t border-white/10 pt-6 text-sm sm:flex-row sm:justify-between">
          <span>© {year} {SITE.companyName}. Minden jog fenntartva.</span>
          <nav className="flex items-center gap-5" aria-label="Jogi dokumentumok">
            <a
              href={ASZF_PDF}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              ÁSZF
            </a>
            <a
              href={PRIVACY_PDF}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              Adatkezelési Tájékoztató
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
