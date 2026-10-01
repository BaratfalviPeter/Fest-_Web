/**
 * ============================================================================
 *  EMAILJS KONFIGURÁCIÓ – a kapcsolati űrlap levélküldéséhez
 * ============================================================================
 *
 *  Nincs saját backend, ezért az EmailJS (https://www.emailjs.com) küldi a
 *  leveleket közvetlenül a böngészőből. Az alábbi azonosítókat az EmailJS
 *  fiókodból kell kitölteni (egyszeri beállítás):
 *
 *  1) Hozz létre egy EmailJS fiókot és egy Email Service-t (pl. Gmail) ->
 *     innen jön a SERVICE_ID. A szolgáltatás "feladó" címe lesz a rendszer
 *     küldő címe (NEM az ügyfél e-mailje -> így nem akad fenn a spamszűrőn).
 *
 *  2) Készíts KÉT e-mail sablont (Email Templates):
 *     a) ADMIN értesítő (nekünk):
 *        - To Email:    {{to_email}}     (a lenti adminEmail)
 *        - Reply To:    {{reply_to}}     (az ügyfél e-mailje -> rá tudsz válaszolni)
 *        - Tárgy/Body:  használja a {{from_name}}, {{from_phone}}, {{from_email}},
 *                       {{message}} és a {{quote_details}} változókat.
 *        -> innen jön az ADMIN_TEMPLATE_ID
 *     b) AUTO-REPLY (az ügyfélnek):
 *        - To Email:    {{to_email}}     (itt az ügyfél e-mailje)
 *        - Tárgy:       Sikeres árajánlatkérés - [Cégnév]
 *        - Body:        a {{to_name}} és {{quote_details}} változókkal.
 *        -> innen jön az AUTO_REPLY_TEMPLATE_ID
 *
 *  3) Account -> General -> Public Key -> ez a PUBLIC_KEY.
 *
 *  Amíg a placeholderek vannak beállítva (lenti isConfigured() = false),
 *  az űrlap "demó módban" fut: nem küld valódi levelet, csak sikeres
 *  visszajelzést mutat (fejlesztéshez / bemutatóhoz).
 *
 *  --- reCAPTCHA v3 (láthatatlan, spam elleni védelem) ---
 *  4) https://www.google.com/recaptcha/admin -> új oldal regisztrálása
 *     v3 típussal; add meg a domaint (pl. baratfalvipeter.github.io).
 *     A "Site Key" kerül a lenti recaptchaSiteKey mezőbe (ez publikus,
 *     mehet a frontend kódba). A "Secret Key"-t az EmailJS-ben kell megadni:
 *     EmailJS -> Account -> Security -> "Enable reCAPTCHA v3" -> Secret Key.
 *     Így az EmailJS a szerveroldalon ellenőrzi a tokent küldés előtt.
 * ============================================================================
 */

export const EMAIL_CONFIG = {
  serviceId: 'service_rd6zvnh',
  adminTemplateId: 'template_5nhcgb9',
  autoReplyTemplateId: 'template_fq3i7pu',
  publicKey: 'FM8GFM9L58Kv6L5NY',
  /** Ide érkeznek az ajánlatkérések (admin értesítő címzettje). */
  adminEmail: 'baratfalvipeter@gmail.com',
  /**
   * Google reCAPTCHA v3 (Invisible) SITE KEY – publikus kulcs, mehet a kódba.
   * Amíg placeholder, a reCAPTCHA ki van kapcsolva (az űrlap token nélkül küld).
   * A SECRET KEY-t NE ide tedd – az az EmailJS Security beállításába megy!
   */
  recaptchaSiteKey: '6LfGTNktAAAAANPQYS9DK_XesbXzDf2JSZkC45yn',
} as const;

/** True, ha a valós EmailJS azonosítók be vannak állítva (nem placeholder). */
export function isEmailConfigured(): boolean {
  return (
    !EMAIL_CONFIG.serviceId.startsWith('YOUR_') &&
    !EMAIL_CONFIG.adminTemplateId.startsWith('YOUR_') &&
    !EMAIL_CONFIG.publicKey.startsWith('YOUR_')
  );
}

/** True, ha a reCAPTCHA v3 Site Key be van állítva (nem placeholder). */
export function isRecaptchaConfigured(): boolean {
  return !EMAIL_CONFIG.recaptchaSiteKey.startsWith('YOUR_');
}
