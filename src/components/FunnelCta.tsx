import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface Props {
  /** A CTA fölötti figyelemfelkeltő cím. */
  title: string;
  /** A gomb felirata. */
  buttonLabel: string;
  /**
   * Cél. Kétféle lehet:
   *  - útvonal (pl. "/referenciak") -> react-router navigáció,
   *  - főoldali szekció (pl. "#kapcsolat") -> a főoldalra megy és odagörget.
   */
  to: string;
}

/**
 * Értékesítési tölcsér (sales funnel) CTA – minden oldal alján, a footer fölött.
 * A logikai folyamat következő lépésére viszi a látogatót.
 */
export default function FunnelCta({ title, buttonLabel, to }: Props) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to.startsWith('#')) {
      // Főoldali szekció: navigálás a főoldalra, majd görgetés a szekcióhoz.
      const id = to.slice(1);
      navigate('/');
      window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      navigate(to);
    }
  };

  return (
    <section className="bg-primary-dark py-16 lg:py-20">
      <div className="section-container text-center">
        <h2 className="mx-auto max-w-2xl text-2xl font-extrabold text-white sm:text-3xl">
          {title}
        </h2>
        <button onClick={handleClick} className="btn-accent mt-8 text-lg">
          {buttonLabel}
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
