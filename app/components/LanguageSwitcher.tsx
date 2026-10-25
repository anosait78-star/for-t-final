"use client";

import { useRouter } from "next/navigation";
import type { Locale } from "@/app/lib/i18n/dictionaries";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter();
  const next: Locale = locale === "en" ? "ar" : "en";

  function switchLocale() {
    document.cookie = `locale=${next}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={switchLocale}
      className="rounded-full border border-gold-500/50 px-3 py-1 text-xs font-medium text-gold-400 transition-colors hover:bg-gold-500 hover:text-navy-950"
    >
      {next === "ar" ? "العربية" : "English"}
    </button>
  );
}
