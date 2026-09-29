# [Cégnév] – Szobafestő Mester | Landing Page + Interaktív Árkalkulátor

Prémium festővállalkozás konverziófókuszú, reszponzív egyoldalas weboldala, modern
komponens-alapú React architektúrával. Backend nincs – tisztán frontend, React
állapotkezeléssel.

## Technológiai stack

| Terület        | Választás                     |
| -------------- | ----------------------------- |
| Keretrendszer  | React 18 + **Vite**           |
| Nyelv          | **TypeScript** (strict)       |
| Styling        | **Tailwind CSS**              |
| Ikonok         | **lucide-react**              |

## Telepítés és futtatás

> Internetkapcsolat szükséges a függőségek telepítéséhez.

```bash
npm install      # függőségek telepítése
npm run dev      # fejlesztői szerver (http://localhost:5173)
npm run build    # éles build a dist/ mappába (tsc -b + vite build)
npm run preview  # az éles build helyi előnézete
```

## Projektstruktúra

```
festo-landing/
├─ index.html                 # SEO meta + LocalBusiness JSON-LD schema
├─ tailwind.config.js         # dizájnrendszer: primary (mélykék), accent (narancs), Inter
├─ src/
│  ├─ main.tsx                # React belépési pont
│  ├─ App.tsx                 # oldalösszeállítás
│  ├─ index.css               # Tailwind rétegek + újrahasznált gomb-osztályok
│  ├─ data/
│  │  ├─ site.ts              # cég mintaadatok (mock data) + navigáció
│  │  └─ content.ts           # szolgáltatások, előnyök, galéria (Unsplash + alt)
│  ├─ components/             # oldal szekciók
│  │  ├─ Header.tsx           # sticky fejléc, mobil menü, "Kérjen ajánlatot" CTA
│  │  ├─ Hero.tsx             # teljes képernyős hero, H1, "Irány az Árkalkulátor"
│  │  ├─ Services.tsx         # 3 szolgáltatás rács, lucide ikonokkal
│  │  ├─ About.tsx            # tapasztalat, tiszta munka, garancia
│  │  ├─ Gallery.tsx          # 6 referencia kép (Unsplash)
│  │  ├─ Contact.tsx          # kapcsolati űrlap (csak UI, sikeres küldés state-tel)
│  │  └─ Footer.tsx           # elérhetőségek + copyright
│  └─ calculator/             # ★ az interaktív árkalkulátor
│     ├─ types.ts             # Room, WallId, ConditionId, RoomCost típusok
│     ├─ constants.ts         # PRICES egységárak + falállapot szorzók + Ft formázás
│     ├─ calc.ts              # tiszta számítási függvények (könnyen tesztelhető)
│     ├─ WallDiagram.tsx      # interaktív 2D SVG felülnézet, kattintható falakkal
│     ├─ ConditionSelector.tsx# 3 kártyás vizuális falállapot választó
│     ├─ RoomCard.tsx         # egy szoba: méretek → rajz → állapot → részösszeg
│     └─ Calculator.tsx       # szobák kezelése + sticky összköltség sáv
```

## Az árkalkulátor logikája

Egységárak (`src/calculator/constants.ts`):

- Falfestés alapdíj: **1 500 Ft/m²**
- Mennyezetfestés: **1 500 Ft/m²**
- Tapéta eltávolítás felár: **1 000 Ft/m²**

Szakmai számítás (ajtókat/ablakokat **nem** vonunk le):

- Falfelület = `2 × (szélesség + hosszúság) × belmagasság`
- Mennyezet = `szélesség × hosszúság`
- Tapéta felár = a rajzon kijelölt falszakaszok (`falhossz × belmagasság`) területére

Falállapot szorzók: **Kiváló 1×**, **Enyhén rossz 1,5×**, **Nagyon rossz 2,2×**
(a fal- és mennyezetfestés díjára hat).

Az összesített költség valós időben, `useMemo`-val frissül, és egy mobilon tapadós
(sticky) sávban mindig látható.

## Testreszabás

A cég összes adata egy helyen: **`src/data/site.ts`**. Cseréld le a `[Cégnév]`,
`[Település]`, `[X]`, telefon és e-mail helyőrzőket a valós értékekre. A
`LocalBusiness` schema-t az `index.html` `<head>` részében frissítsd ugyanezekkel.
