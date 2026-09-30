/**
 * Központi mintaadatok (mock data).
 * Egy helyen módosítható a cég minden adata – az egész UI innen olvas.
 * A szögletes zárójeles helyőrzőket cseréld le a valós adatokra.
 */
export const SITE = {
  companyName: '[Cégnév] - Szobafestő Mester',
  shortName: '[Cégnév]',
  town: '[Település]',
  serviceRadiusKm: '[X]',
  yearsExperience: '[X]',
  phone: '+36 [00] [000] [0000]',
  phoneHref: 'tel:+3600000000',
  email: '[email@cegnev.hu]',
  emailHref: 'mailto:[email@cegnev.hu]',
} as const;

export interface NavItem {
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Szolgáltatások', href: '#szolgaltatasok' },
  { label: 'Rólunk', href: '#rolunk' },
  { label: 'Referenciák', href: '/referenciak' },
  { label: 'Színtervező', href: '#szintervezo' },
  { label: 'Árkalkulátor', href: '#kalkulator' },
  { label: 'Kapcsolat', href: '#kapcsolat' },
];
