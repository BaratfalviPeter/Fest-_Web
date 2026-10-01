import { useState, type FormEvent } from 'react';
import { useLocation } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { Phone, Mail, MapPin, Send, CheckCircle2, Loader2, AlertCircle, Calculator } from 'lucide-react';
import { SITE } from '../data/site';
import { EMAIL_CONFIG, isEmailConfigured } from '../config/emailConfig';
import { formatHuf } from '../calculator/constants';
import type { QuoteSummary } from '../calculator/types';

type SendState = 'idle' | 'sending' | 'success' | 'error';

export default function Contact() {
  const location = useLocation();
  // Az Árkalkulátorból érkező kalkuláció összegzése (ha van).
  const quote = (location.state as { quote?: QuoteSummary } | null)?.quote;

  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [status, setStatus] = useState<SendState>('idle');

  const update = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  // A kalkuláció szövegesen – ez kerül a levélbe ({{quote_details}}).
  const quoteDetailsText = (): string => {
    if (!quote) return 'Az ügyfél nem csatolt árkalkulációt.';
    const lines = quote.rooms.map(
      (r) => `• ${r.name} (${r.dimensions}, állapot: ${r.condition}) – ${formatHuf(r.total)}`,
    );
    return [
      `Szobák száma: ${quote.roomCount}`,
      `Összes festendő felület: ${quote.totalPaintableArea.toFixed(1)} m²`,
      `Becsült festékszükséglet: ${quote.totalPaintLiters.toFixed(1)} l`,
      `Összesített várható költség: ${formatHuf(quote.grandTotal)}`,
      '',
      'Szobánként:',
      ...lines,
    ].join('\n');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');

    // Demó mód: ha nincsenek beállítva a valós EmailJS azonosítók, nem
    // küldünk valódi levelet, csak sikeres visszajelzést adunk.
    if (!isEmailConfigured()) {
      // eslint-disable-next-line no-console
      console.info('[Demó] EmailJS nincs beállítva – a levél nem került elküldésre.', {
        form,
        quote,
      });
      window.setTimeout(() => setStatus('success'), 600);
      return;
    }

    // A sablonok közös változói.
    const templateParams = {
      to_email: EMAIL_CONFIG.adminEmail, // admin értesítő címzettje
      from_name: form.name,
      from_phone: form.phone,
      from_email: form.email,
      reply_to: form.email, // rá tudunk válaszolni az admin levélből
      message: form.message,
      quote_details: quoteDetailsText(),
    };

    try {
      emailjs.init({ publicKey: EMAIL_CONFIG.publicKey });

      // 1) Admin értesítő (nekünk).
      await emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.adminTemplateId, templateParams);

      // 2) Auto-reply az ügyfélnek (ha megadott e-mailt).
      if (form.email) {
        await emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.autoReplyTemplateId, {
          to_email: form.email,
          to_name: form.name,
          quote_details: quoteDetailsText(),
        });
      }

      setStatus('success');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('EmailJS küldési hiba:', err);
      setStatus('error');
    }
  };

  const resetForm = () => {
    setForm({ name: '', phone: '', email: '', message: '' });
    setStatus('idle');
  };

  return (
    <section id="kapcsolat" className="bg-gray-50 py-20 lg:py-28">
      <div className="section-container grid gap-12 lg:grid-cols-2">
        {/* Elérhetőségek + kalkuláció-összesítő */}
        <div>
          <span className="text-sm font-bold uppercase tracking-wider text-accent">Kapcsolat</span>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Kérjen ingyenes ajánlatot
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Írjon nekünk, vagy hívjon telefonon – 24 órán belül felvesszük Önnel a kapcsolatot és
            egyeztetünk egy díjmentes helyszíni felmérésről.
          </p>

          <ul className="mt-8 space-y-5">
            <li className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Phone className="h-6 w-6" />
              </span>
              <div>
                <span className="block text-sm text-gray-500">Telefon</span>
                <a href={SITE.phoneHref} className="font-semibold text-gray-900 hover:text-primary">
                  {SITE.phone}
                </a>
              </div>
            </li>
            <li className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Mail className="h-6 w-6" />
              </span>
              <div>
                <span className="block text-sm text-gray-500">E-mail</span>
                <a href={SITE.emailHref} className="font-semibold text-gray-900 hover:text-primary">
                  {SITE.email}
                </a>
              </div>
            </li>
            <li className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MapPin className="h-6 w-6" />
              </span>
              <div>
                <span className="block text-sm text-gray-500">Területünk</span>
                <span className="font-semibold text-gray-900">
                  {SITE.town} és {SITE.serviceRadiusKm} km-es vonzáskörzete
                </span>
              </div>
            </li>
          </ul>

          {/* Kalkuláció összesítő kártya – ha az Árkalkulátorból érkezett adat */}
          {quote && (
            <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <h3 className="flex items-center gap-2 font-bold text-gray-900">
                <Calculator className="h-5 w-5 text-primary" />
                Az Ön kalkulációja
              </h3>
              <dl className="mt-3 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Szobák száma</dt>
                  <dd className="font-semibold text-gray-900">{quote.roomCount}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Összes festendő felület</dt>
                  <dd className="font-semibold text-gray-900">
                    {quote.totalPaintableArea.toFixed(1)} m²
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Becsült festékszükséglet</dt>
                  <dd className="font-semibold text-gray-900">
                    {quote.totalPaintLiters.toFixed(1)} l
                  </dd>
                </div>
                <div className="flex justify-between border-t border-primary/15 pt-2 text-base">
                  <dt className="font-bold text-gray-900">Várható költség</dt>
                  <dd className="font-extrabold text-primary">{formatHuf(quote.grandTotal)}</dd>
                </div>
              </dl>
              <p className="mt-3 text-xs text-gray-500">
                Ezeket az adatokat az üzenettel együtt elküldjük – tájékoztató jellegűek, a pontos
                árat a helyszíni felmérés rögzíti.
              </p>
            </div>
          )}
        </div>

        {/* Kapcsolati űrlap */}
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          {status === 'success' ? (
            <div className="flex h-full min-h-[24rem] flex-col items-center justify-center text-center">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
              <h3 className="mt-4 text-2xl font-bold text-gray-900">Köszönjük megkeresését!</h3>
              <p className="mt-2 text-gray-600">
                Üzenetét {quote ? 'és a kalkulációt ' : ''}megkaptuk. Kollégánk 2-3 munkanapon belül
                felveszi Önnel a kapcsolatot a megadott elérhetőségen.
              </p>
              <button onClick={resetForm} className="btn-outline mt-6">
                Új üzenet küldése
              </button>
            </div>
          ) : status === 'error' ? (
            /* Hiba-fallback: ha az EmailJS nem elérhető (keret kimerült / API
               leállt), barátságos üzenet az alternatív elérhetőségekkel. */
            <div className="flex h-full min-h-[24rem] flex-col items-center justify-center text-center">
              <AlertCircle className="h-16 w-16 text-amber-500" />
              <h3 className="mt-4 text-2xl font-bold text-gray-900">
                Az ajánlatkérő átmenetileg nem elérhető
              </h3>
              <p className="mt-3 max-w-md text-gray-600">
                Az automatikus ajánlatkérő rendszer átmenetileg nem elérhető. Kérjük, keressen
                minket bizalommal telefonon, vagy írjon közvetlenül e-mailben az adatokkal!
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a href={SITE.phoneHref} className="btn-primary">
                  <Phone className="h-5 w-5" />
                  {SITE.phone}
                </a>
                <a href={SITE.emailHref} className="btn-outline">
                  <Mail className="h-5 w-5" />
                  {SITE.email}
                </a>
              </div>
              <button onClick={() => setStatus('idle')} className="mt-6 text-sm font-medium text-gray-500 hover:text-primary">
                Vissza az űrlaphoz
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Név
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="Kovács János"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-gray-700">
                    Telefon
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    placeholder="+36 30 123 4567"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                    E-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder="janos@example.hu"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Üzenet
                </label>
                <textarea
                  id="message"
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                  placeholder="Írja le röviden, milyen munkában segíthetünk..."
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="btn-accent w-full text-lg disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === 'sending' ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Küldés…
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Üzenet küldése
                  </>
                )}
              </button>
              <p className="text-center text-xs text-gray-400">
                Adatait kizárólag az ajánlatkérés feldolgozásához használjuk fel.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
