import type { LucideIcon } from 'lucide-react';
import { Paintbrush, Home, Layers, ShieldCheck, Sparkles, Clock } from 'lucide-react';
import { SITE } from './site';

export interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const SERVICES: Service[] = [
  {
    icon: Paintbrush,
    title: 'Beltéri festés',
    description:
      'Lakások, házak és irodák prémium minőségű beltéri festése. Fóliázás, glettelés, alapozás és a legmodernebb, alacsony szagú festékek használata.',
  },
  {
    icon: Home,
    title: 'Kültéri munkák',
    description:
      'Homlokzatfestés, lábazatok és kerítések felújítása időjárásálló, tartós anyagokkal. Esztétikus és védő bevonat az épület hosszú élettartamáért.',
  },
  {
    icon: Layers,
    title: 'Tapétázás',
    description:
      'Klasszikus és fotótapéták szakszerű felhelyezése, a régi tapéta gondos eltávolítása és a felület tökéletes előkészítése a makulátlan végeredményért.',
  },
];

export interface Advantage {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const ADVANTAGES: Advantage[] = [
  {
    icon: Clock,
    title: `${SITE.yearsExperience} év tapasztalat`,
    description: `Több mint ${SITE.yearsExperience} év szakmai gyakorlat ${SITE.town} és környéke lakóinak szolgálatában.`,
  },
  {
    icon: Sparkles,
    title: 'Tiszta munkavégzés',
    description:
      'Bútorok és padló gondos letakarása, a munkaterület napi takarítása. Úgy adjuk át, ahogy szeretné megkapni.',
  },
  {
    icon: ShieldCheck,
    title: 'Garancia',
    description:
      'Minden elvégzett munkára írásos garanciát vállalunk. Minőségi anyagok, precíz kivitelezés, megbízható háttér.',
  },
];

export interface GalleryImage {
  src: string;
  alt: string;
}

/**
 * Referencia galéria – Unsplash stock fotók.
 * A width/quality paraméterek optimalizálják a betöltést.
 */
export const GALLERY: GalleryImage[] = [
  {
    src: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80',
    alt: `Minőségi falfestés ${SITE.town} területén – frissen festett nappali`,
  },
  {
    src: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80',
    alt: `Beltéri szobafestés ${SITE.town} környékén – festő munka közben`,
  },
  {
    src: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
    alt: `Precíz falfestés hengerrel ${SITE.town} területén`,
  },
  {
    src: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
    alt: `Felújított, kifestett modern otthon ${SITE.town} vonzáskörzetében`,
  },
  {
    src: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=800&q=80',
    alt: `Kész festési munka – világos, tiszta lakótér ${SITE.town} területén`,
  },
  {
    src: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=80',
    alt: `Igényes tapétázás és falfestés ${SITE.town} környékén`,
  },
];
