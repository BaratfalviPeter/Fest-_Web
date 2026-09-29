import { GALLERY } from '../data/content';

export default function Gallery() {
  return (
    <section id="referenciak" className="bg-white py-20 lg:py-28">
      <div className="section-container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-accent">
            Munkáink
          </span>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">Referenciák</h2>
          <p className="mt-4 text-lg text-gray-600">
            Néhány elkészült munkánk – a részletekben rejlik a különbség.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3">
          {GALLERY.map((image, i) => (
            <figure
              key={image.src}
              className={`group relative overflow-hidden rounded-2xl shadow-sm ${
                i === 0 ? 'col-span-2 row-span-2 md:col-span-1 md:row-span-1' : ''
              }`}
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-primary/0 transition-colors duration-300 group-hover:bg-primary/20" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
