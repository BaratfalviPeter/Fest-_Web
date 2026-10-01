import { SITE } from '../data/site';
import LegalPage from './LegalPage';

/**
 * Adatkezelési Tájékoztató – egyelőre placeholder (lorem ipsum) tartalommal.
 * A valós, jogilag pontos szöveget később kell behelyettesíteni.
 */
export default function PrivacyPage() {
  return (
    <LegalPage
      title="Adatkezelési Tájékoztató"
      subtitle={`${SITE.companyName} – a személyes adatok kezeléséről`}
    >
      <p className="text-sm italic text-amber-700">
        ⚠️ Ez egy placeholder szöveg (lorem ipsum). A végleges, jogilag pontos
        Adatkezelési Tájékoztatót szakértővel kell elkészíttetni és ide behelyettesíteni.
      </p>

      <h2 className="text-xl font-bold text-gray-900">1. Az adatkezelő</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
      </p>

      <h2 className="text-xl font-bold text-gray-900">2. A kezelt adatok köre</h2>
      <p>
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
        nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.
      </p>

      <h2 className="text-xl font-bold text-gray-900">3. Az adatkezelés célja és jogalapja</h2>
      <p>
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
        laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi.
      </p>

      <h2 className="text-xl font-bold text-gray-900">4. Az adatok tárolása és továbbítása</h2>
      <p>
        Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
        consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
      </p>

      <h2 className="text-xl font-bold text-gray-900">5. Az érintett jogai</h2>
      <p>
        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium
        voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint.
      </p>
    </LegalPage>
  );
}
