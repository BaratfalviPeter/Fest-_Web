import { SERVICES } from '../data/content';

export default function Services() {
  return (
    <section id="szolgaltatasok" className="bg-white py-20 lg:py-28">
      <div className="section-container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-accent">
            Amivel foglalkozunk
          </span>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Szolgáltatásaink
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            A teljes körű felújítástól az egyszerű frissítésig – minden festési munkát profi
            precizitással végzünk el.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <article
                key={service.title}
                className="group rounded-2xl border border-gray-100 bg-gray-50 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:bg-white hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-white transition-colors group-hover:bg-accent">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-gray-900">{service.title}</h3>
                <p className="mt-3 leading-relaxed text-gray-600">{service.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
