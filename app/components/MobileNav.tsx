"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/app/components/LanguageSwitcher";
import type { Locale } from "@/app/lib/i18n/dictionaries";
import { LANGUAGE_SWITCHER_ENABLED } from "@/app/lib/i18n/config";

type NavLink = { href: string; label: string };

export function MobileNav({
  navLinks,
  adminLabel,
  locale,
  menuLabel,
  closeLabel,
}: {
  navLinks: NavLink[];
  adminLabel: string;
  locale: Locale;
  menuLabel: string;
  closeLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={menuLabel}
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-md border border-white/15 text-white"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {open && mounted &&
        createPortal(
          <div className="fixed inset-0 z-[100]">
            <button
              type="button"
              aria-label={closeLabel}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-navy-950/70"
            />
            <div className="absolute inset-y-0 end-0 flex w-[82%] max-w-xs flex-col bg-navy-900 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <span className="text-sm font-semibold uppercase tracking-wide text-gold-400">
                  {menuLabel}
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={closeLabel}
                  className="flex h-9 w-9 items-center justify-center rounded-md text-white/80 hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>

              <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-md px-3 py-3 text-base font-medium text-slate-100 transition-colors hover:bg-white/5"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/admin/login"
                  className="mt-2 rounded-md border-t border-white/10 px-3 pt-4 text-sm text-slate-400 hover:text-white"
                >
                  {adminLabel}
                </Link>
              </nav>

              {LANGUAGE_SWITCHER_ENABLED && (
                <div className="border-t border-white/10 px-5 py-4">
                  <LanguageSwitcher locale={locale} />
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
