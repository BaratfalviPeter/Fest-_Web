import { SITE } from '../data/site';
import LegalPage from './LegalPage';

/**
 * Általános Szerződési Feltételek (ÁSZF) – egyelőre placeholder (lorem ipsum)
 * tartalommal. A valós, jogilag pontos szöveget később kell behelyettesíteni.
 */
export default function TermsPage() {
  return (
    <LegalPage
      title="Általános Szerződési Feltételek"
      subtitle={`${SITE.companyName} – a szolgáltatás igénybevételének feltételei`}
    >
      <p className="text-sm italic text-amber-700">
        ⚠️ Ez egy placeholder szöveg (lorem ipsum). A végleges, jogilag pontos ÁSZF-et
        szakértővel kell elkészíttetni és ide behelyettesíteni.
      </p>

      <h2 className="text-xl font-bold text-gray-900">1. A Szolgáltató adatai</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
      </p>

      <h2 className="text-xl font-bold text-gray-900">2. A szolgáltatás tárgya</h2>
      <p>
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
        nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.
      </p>

      <h2 className="text-xl font-bold text-gray-900">3. Árajánlat és díjazás</h2>
      <p>
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
        laudantium. Az online árkalkulátor eredménye tájékoztató jellegű, nem minősül kötelező
        érvényű ajánlatnak.
      </p>

      <h2 className="text-xl font-bold text-gray-900">4. Teljesítés és garancia</h2>
      <p>
        Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
        consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
      </p>

      <h2 className="text-xl font-bold text-gray-900">5. Elállás és panaszkezelés</h2>
      <p>
        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium
        voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint.
      </p>
    </LegalPage>
  );
}
