import { cookies } from "next/headers";
import { defaultLocale, locales, type Locale } from "@/app/lib/i18n/dictionaries";

const COOKIE_NAME = "locale";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  return locales.includes(value as Locale) ? (value as Locale) : defaultLocale;
}

export { COOKIE_NAME as LOCALE_COOKIE_NAME };
