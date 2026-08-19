export const locales = ["en", "id"] as const;

export type Locale = (typeof locales)[number];

/** English is the default: the bare root resolves here and it is the x-default hreflang target. */
export const defaultLocale: Locale = "en";

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
