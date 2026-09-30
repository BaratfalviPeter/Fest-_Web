import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Paintbrush, Phone } from 'lucide-react';
import { NAV_ITEMS, SITE } from '../data/site';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Egy szekció-hivatkozás (#id) kezelése: ha a főoldalon vagyunk, sima
  // görgetés; ha másik oldalon (pl. /referenciak), előbb a főoldalra
  // navigálunk, majd a szekcióhoz görgetünk.
  const goToSection = (id: string) => {
    setMenuOpen(false);
    if (onHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      // A DOM frissülése után görgetünk a szekcióhoz.
      window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    }
  };

  // A "Kérjen ajánlatot" gomb az Árkalkulátor aloldalra visz.
  const goToCalculator = () => {
    setMenuOpen(false);
    navigate('/arkalkulator');
  };

  // Egy navigációs elem renderelése: útvonal (/...) -> Link, szekció (#...) -> gomb.
  const renderNavItem = (
    item: (typeof NAV_ITEMS)[number],
    className: string,
    onClick?: () => void,
  ) => {
    if (item.href.startsWith('/')) {
      return (
        <Link
          key={item.href}
          to={item.href}
          onClick={() => {
            setMenuOpen(false);
            onClick?.();
          }}
          className={className}
        >
          {item.label}
        </Link>
      );
    }
    return (
      <button
        key={item.href}
        type="button"
        onClick={() => goToSection(item.href.slice(1))}
        className={className}
      >
        {item.label}
      </button>
    );
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 shadow-md backdrop-blur' : 'bg-transparent'
      }`}
    >
      <div className="section-container flex h-16 items-center justify-between lg:h-20">
        {/* Logó */}
        <Link to="/" className="flex items-center gap-2" aria-label={SITE.companyName}>
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
              scrolled ? 'bg-primary text-white' : 'bg-white text-primary'
            }`}
          >
            <Paintbrush className="h-6 w-6" />
          </span>
          <span
            className={`text-lg font-extrabold leading-tight transition-colors ${
              scrolled ? 'text-gray-900' : 'text-white'
            }`}
          >
            {SITE.shortName}
            <span className="block text-xs font-medium opacity-80">Szobafestő Mester</span>
          </span>
        </Link>

        {/* Asztali navigáció */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Fő navigáció">
          {NAV_ITEMS.map((item) =>
            renderNavItem(
              item,
              `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                scrolled ? 'text-gray-700 hover:text-primary' : 'text-white/90 hover:text-white'
              }`,
            ),
          )}
        </nav>

        {/* CTA + telefon (asztali) */}
        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={SITE.phoneHref}
            className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
              scrolled ? 'text-primary hover:text-primary-dark' : 'text-white hover:text-accent-light'
            }`}
          >
            <Phone className="h-4 w-4" />
            {SITE.phone}
          </a>
          <button onClick={goToCalculator} className="btn-accent px-5 py-2.5 text-sm">
            Kérjen ajánlatot
          </button>
        </div>

        {/* Mobil menü gomb */}
        <button
          className={`rounded-md p-2 lg:hidden ${scrolled ? 'text-gray-800' : 'text-white'}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Menü bezárása' : 'Menü megnyitása'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobil menü */}
      {menuOpen && (
        <nav className="border-t border-gray-100 bg-white shadow-lg lg:hidden" aria-label="Mobil navigáció">
          <div className="section-container flex flex-col py-4">
            {NAV_ITEMS.map((item) =>
              renderNavItem(
                item,
                'rounded-md px-3 py-3 text-left font-medium text-gray-700 hover:bg-gray-50 hover:text-primary',
              ),
            )}
            <a
              href={SITE.phoneHref}
              className="mt-2 flex items-center gap-2 px-3 py-3 font-semibold text-primary"
            >
              <Phone className="h-4 w-4" />
              {SITE.phone}
            </a>
            <button onClick={goToCalculator} className="btn-accent mt-2">
              Kérjen ajánlatot
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
