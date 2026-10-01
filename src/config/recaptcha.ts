import { EMAIL_CONFIG, isRecaptchaConfigured } from './emailConfig';

/**
 * Google reCAPTCHA v3 (Invisible) segédek.
 *
 * A v3 teljesen a háttérben fut (nincs kép-kiválasztós kihívás): a
 * grecaptcha.execute() egy tokent ad, amit az EmailJS a 'g-recaptcha-response'
 * paraméterben kap meg, és a Secret Key-jel szerveroldalon ellenőriz.
 */

// A grecaptcha globális objektum minimális típusa (nincs külső @types csomag).
interface Grecaptcha {
  ready: (cb: () => void) => void;
  execute: (siteKey: string, opts: { action: string }) => Promise<string>;
}
declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
  }
}

let scriptPromise: Promise<void> | null = null;

/** A reCAPTCHA v3 script egyszeri, dinamikus betöltése a Site Key-jel. */
export function loadRecaptcha(): Promise<void> {
  if (!isRecaptchaConfigured()) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const src = `https://www.google.com/recaptcha/api.js?render=${EMAIL_CONFIG.recaptchaSiteKey}`;
    // Ha már betöltődött (pl. újramountolás), ne töltsük újra.
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('reCAPTCHA script betöltése sikertelen'));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

/**
 * reCAPTCHA v3 token lekérése egy adott akcióhoz.
 * Ha nincs beállítva a Site Key, null-t ad vissza (a küldés token nélkül megy).
 */
export async function getRecaptchaToken(action: string): Promise<string | null> {
  if (!isRecaptchaConfigured()) return null;
  await loadRecaptcha();
  const grecaptcha = window.grecaptcha;
  if (!grecaptcha) return null;

  return new Promise<string | null>((resolve) => {
    grecaptcha.ready(() => {
      grecaptcha
        .execute(EMAIL_CONFIG.recaptchaSiteKey, { action })
        .then((token) => resolve(token))
        .catch(() => resolve(null));
    });
  });
}
