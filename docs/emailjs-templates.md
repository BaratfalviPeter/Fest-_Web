# EmailJS sablonok – beállítási útmutató

Ez a dokumentum a két EmailJS sablon pontos tartalmát adja, a kódban (`src/components/Contact.tsx`) ténylegesen küldött változónevekkel. Másold be őket az EmailJS felületére.

> **Fontos:** az EmailJS sablonnál a **To / Reply-To / Subject / From Name** mezőket a sablon **Settings** fülén állítod be (ezekbe is írhatsz `{{változó}}`-t), a **Content** fül pedig a levél törzse. Alább mindkettőt megadom.

A `[Cégnév]` / `[Település]` helyőrzőket cseréld a valós adatokra (vagy írd át a saját céged nevére).

---

## 1) ADMIN értesítő sablon (nekünk érkezik)

**Küldött változók:** `to_email`, `from_name`, `from_phone`, `from_email`, `reply_to`, `message`, `quote_details`

### Settings fül
| Mező | Érték |
|---|---|
| **To Email** | `{{to_email}}` |
| **From Name** | `[Cégnév] – Weboldal` |
| **Reply To** | `{{reply_to}}` |
| **Subject** | `Új árajánlatkérés – {{from_name}}` |

### Content fül – Plain text verzió
```
Új árajánlatkérés érkezett a weboldalról.

ÜGYFÉL ADATAI
-------------
Név:      {{from_name}}
Telefon:  {{from_phone}}
E-mail:   {{from_email}}

ÜZENET
------
{{message}}

KALKULÁCIÓ
----------
{{quote_details}}

(A levélre közvetlenül válaszolva az ügyfél e-mail címére írsz.)
```

### Content fül – HTML verzió (ha a sablon HTML módban van)
```html
<div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">
  <h2 style="color: #1d4ed8; margin-bottom: 4px;">Új árajánlatkérés</h2>
  <p style="color: #6b7280; margin-top: 0;">A weboldal kapcsolati űrlapjáról.</p>

  <h3 style="color: #1f2937; border-bottom: 2px solid #f3f4f6; padding-bottom: 6px;">Ügyfél adatai</h3>
  <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
    <tr>
      <td style="padding: 6px 0; color: #6b7280; width: 90px;">Név</td>
      <td style="padding: 6px 0; font-weight: 600;">{{from_name}}</td>
    </tr>
    <tr>
      <td style="padding: 6px 0; color: #6b7280;">Telefon</td>
      <td style="padding: 6px 0; font-weight: 600;">{{from_phone}}</td>
    </tr>
    <tr>
      <td style="padding: 6px 0; color: #6b7280;">E-mail</td>
      <td style="padding: 6px 0; font-weight: 600;">{{from_email}}</td>
    </tr>
  </table>

  <h3 style="color: #1f2937; border-bottom: 2px solid #f3f4f6; padding-bottom: 6px;">Üzenet</h3>
  <p style="font-size: 14px; line-height: 1.6; white-space: pre-line;">{{message}}</p>

  <h3 style="color: #1f2937; border-bottom: 2px solid #f3f4f6; padding-bottom: 6px;">Kalkuláció</h3>
  <pre style="font-family: Inter, Arial, sans-serif; font-size: 14px; line-height: 1.6; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 14px; white-space: pre-wrap;">{{quote_details}}</pre>

  <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">
    Erre a levélre válaszolva közvetlenül az ügyfélnek írsz ({{reply_to}}).
  </p>
</div>
```

---

## 2) AUTO-REPLY sablon (az ügyfélnek megy)

**Küldött változók:** `to_email`, `to_name`, `quote_details`

### Settings fül
| Mező | Érték |
|---|---|
| **To Email** | `{{to_email}}` |
| **From Name** | `[Cégnév] – Szobafestő Mester` |
| **Reply To** | *(a céges e-mail címed, pl. info@cegnev.hu)* |
| **Subject** | `Sikeres árajánlatkérés - [Cégnév]` |

### Content fül – Plain text verzió
```
Kedves {{to_name}}!

Köszönjük megkeresését. Érdeklődését és a kalkulált adatokat sikeresen megkaptuk.
Kollégánk 2-3 munkanapon belül felveszi Önnel a kapcsolatot a megadott
elérhetőségeken a pontosítás és az ingyenes helyszíni felmérés egyeztetése céljából.

Az Ön által küldött kalkuláció:
{{quote_details}}

Üdvözlettel:
A [Cégnév] csapata
```

### Content fül – HTML verzió
```html
<div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">
  <h2 style="color: #1d4ed8;">Köszönjük megkeresését, {{to_name}}!</h2>

  <p style="font-size: 15px; line-height: 1.7;">
    Érdeklődését és a kalkulált adatokat sikeresen megkaptuk. Kollégánk
    <strong>2-3 munkanapon belül</strong> felveszi Önnel a kapcsolatot a megadott
    elérhetőségeken a pontosítás és az <strong>ingyenes helyszíni felmérés</strong>
    egyeztetése céljából.
  </p>

  <h3 style="color: #1f2937; border-bottom: 2px solid #f3f4f6; padding-bottom: 6px;">Az Ön kalkulációja</h3>
  <pre style="font-family: Inter, Arial, sans-serif; font-size: 14px; line-height: 1.6; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 14px; white-space: pre-wrap;">{{quote_details}}</pre>

  <p style="font-size: 14px; color: #6b7280; margin-top: 8px;">
    Az árkalkuláció tájékoztató jellegű – a pontos árat a helyszíni felmérés során rögzítjük.
  </p>

  <p style="font-size: 15px; margin-top: 24px;">
    Üdvözlettel,<br />
    <strong>A [Cégnév] csapata</strong>
  </p>
</div>
```

---

## Összefoglaló: mely azonosítók hova kerülnek (`src/config/emailConfig.ts`)

| Config kulcs | Hol találod az EmailJS-ben |
|---|---|
| `serviceId` | Email Services → a service ID-ja |
| `adminTemplateId` | az 1) ADMIN sablon Template ID-ja |
| `autoReplyTemplateId` | a 2) AUTO-REPLY sablon Template ID-ja |
| `publicKey` | Account → General → Public Key |
| `adminEmail` | ahova az admin értesítő menjen (most: `baratfalvipeter@gmail.com`) |

Amint mind a 4 azonosító valós (nem `YOUR_...`), az űrlap élesben küld; addig „demó módban" fut (sikeres visszajelzés, de nem küld levelet).
