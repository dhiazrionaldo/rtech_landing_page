export const locales = ["id", "en"] as const;

export type Locale = (typeof locales)[number];

/** Bahasa Indonesia is the default: the deck, the clients, and the buyers are Indonesian. */
export const defaultLocale: Locale = "id";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** BCP-47 tags for <html lang> and hreflang. */
export const htmlLang: Record<Locale, string> = {
  id: "id-ID",
  en: "en",
};

export const localeName: Record<Locale, string> = {
  id: "Bahasa Indonesia",
  en: "English",
};

/** Short label for the switcher. */
export const localeShort: Record<Locale, string> = {
  id: "ID",
  en: "EN",
};
