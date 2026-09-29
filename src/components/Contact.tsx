import { useState, type FormEvent } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { SITE } from '../data/site';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Csak UI – nincs backend. Sikeres küldés state-tel jelezzük.
    setSubmitted(true);
  };

  return (
    <section id="kapcsolat" className="bg-gray-50 py-20 lg:py-28">
      <div className="section-container grid gap-12 lg:grid-cols-2">
        {/* Elérhetőségek */}
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
        </div>

        {/* Kapcsolati űrlap (csak UI) */}
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          {submitted ? (
            <div className="flex h-full min-h-[24rem] flex-col items-center justify-center text-center">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
              <h3 className="mt-4 text-2xl font-bold text-gray-900">Köszönjük megkeresését!</h3>
              <p className="mt-2 text-gray-600">
                Üzenetét megkaptuk. Hamarosan felvesszük Önnel a kapcsolatot a megadott
                elérhetőségen.
              </p>
              <button onClick={() => setSubmitted(false)} className="btn-outline mt-6">
                Új üzenet küldése
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
                  placeholder="Írja le röviden, milyen munkában segíthetünk..."
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <button type="submit" className="btn-accent w-full text-lg">
                <Send className="h-5 w-5" />
                Üzenet küldése
              </button>
              <p className="text-center text-xs text-gray-400">
                Az űrlap kizárólag bemutató célú – az adatokat nem tároljuk.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
