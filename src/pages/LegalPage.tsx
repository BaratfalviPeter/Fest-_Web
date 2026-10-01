import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

interface Props {
  title: string;
  /** Rövid alcím a fejléc alatt. */
  subtitle?: string;
  children: ReactNode;
}

/**
 * Közös elrendezés a jogi aloldalakhoz (Adatkezelés, ÁSZF).
 * Sötét fejléc-sáv (hogy a fix Header olvasható legyen) + tartalom + vissza link.
 */
export default function LegalPage({ title, subtitle, children }: Props) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main>
      {/* Fejléc-sáv */}
      <section className="bg-primary-dark pt-28 pb-14 text-white lg:pt-36">
        <div className="section-container text-center">
          <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-accent-light">
            <FileText className="h-4 w-4" />
            Jogi tájékoztató
          </span>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">{title}</h1>
          {subtitle && <p className="mx-auto mt-3 max-w-2xl text-white/85">{subtitle}</p>}
        </div>
      </section>

      {/* Tartalom */}
      <div className="section-container py-14 lg:py-16">
        <article className="prose-legal mx-auto max-w-3xl space-y-4 text-gray-700">
          {children}
        </article>

        <div className="mx-auto mt-12 max-w-3xl border-t border-gray-100 pt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-semibold text-primary hover:text-primary-dark"
          >
            <ArrowLeft className="h-5 w-5" />
            Vissza a főoldalra
          </Link>
        </div>
      </div>
    </main>
  );
}
