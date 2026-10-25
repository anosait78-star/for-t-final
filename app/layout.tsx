import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Sans_Arabic } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";
import { getLocale } from "@/app/lib/i18n/locale";
import { getDictionary } from "@/app/lib/i18n/dictionaries";
import { LanguageSwitcher } from "@/app/components/LanguageSwitcher";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["500", "600", "700"],
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const arabicSans = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
});

export const metadata: Metadata = {
  title: "FOR T",
  description:
    "FOR T — international training and accreditation body: certified courses, professional coaches, and verifiable certificates.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const navLinks = [
    { href: "/", label: dict.nav.home },
    { href: "/courses", label: dict.nav.courses },
    { href: "/coaches", label: dict.nav.coaches },
    { href: "/foundations", label: dict.nav.foundations },
    { href: "/certificates", label: dict.nav.certificates },
  ];

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${fraunces.variable} ${inter.variable} ${arabicSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-navy-900 font-sans">
        <header className="bg-navy-900 text-white border-b border-gold-600/40">
          <nav className="mx-auto max-w-6xl flex items-center justify-between px-4 py-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="FOR T"
                width={40}
                height={40}
                className="h-10 w-10 object-contain rounded-full bg-white/95 p-1"
              />
              <span className="leading-tight">
                <span className="block font-serif-display text-lg font-semibold tracking-wide">
                  {dict.siteName}
                </span>
                <span className="hidden sm:block text-[11px] uppercase tracking-[0.15em] text-gold-400">
                  {dict.tagline}
                </span>
              </span>
            </Link>
            <ul className="flex flex-wrap items-center gap-6 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="relative pb-1 text-slate-200 transition-colors hover:text-white after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-center after:scale-x-0 after:bg-gold-500 after:transition-transform hover:after:scale-x-100"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <LanguageSwitcher locale={locale} />
              </li>
            </ul>
          </nav>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="bg-navy-950 text-slate-300 text-sm border-t-2 border-gold-500">
          <div className="mx-auto max-w-6xl px-4 py-12 grid grid-cols-1 sm:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Image
                  src="/logo.png"
                  alt="FOR T"
                  width={32}
                  height={32}
                  className="h-8 w-8 object-contain rounded-full bg-white/95 p-1"
                />
                <span className="font-serif-display text-white font-semibold">
                  {dict.siteName}
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed">{dict.footer.about}</p>
            </div>

            <div>
              <h3 className="text-gold-400 font-semibold mb-3 text-xs uppercase tracking-wider">
                {dict.footer.quickLinks}
              </h3>
              <ul className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-gold-400 font-semibold mb-3 text-xs uppercase tracking-wider">
                {dict.footer.legal}
              </h3>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link href="/admin/login" className="hover:text-white">
                    {dict.nav.adminLogin}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10">
            <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-slate-500">
              © {new Date().getFullYear()} {dict.siteName} — {dict.footer.rights}
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
