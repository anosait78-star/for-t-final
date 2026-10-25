import Link from "next/link";
import type { Dictionary } from "@/app/lib/i18n/dictionaries";

export function BottomNav({ dict }: { dict: Dictionary }) {
  const items = [
    { href: "/", label: dict.nav.home, icon: HomeIcon },
    { href: "/courses", label: dict.nav.courses, icon: CoursesIcon },
    { href: "/certificates", label: dict.nav.certificates, icon: CertificateIcon },
    { href: "/coaches", label: dict.nav.coaches, icon: CoachesIcon },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-white/95 backdrop-blur md:hidden print:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-navy-700 active:text-gold-600"
              >
                <Icon className="h-5 w-5" />
                <span className="line-clamp-1">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 11.5 12 4l8 7.5M6 10v9h12v-9" />
    </svg>
  );
}

function CoursesIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6.5 12 4l8 2.5-8 2.5-8-2.5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 9v6c0 1.4 2.2 3 5 3s5-1.6 5-3V9" />
    </svg>
  );
}

function CertificateIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="4" width="16" height="12" rx="1.5" />
      <circle cx="12" cy="17.5" r="2.5" />
      <path strokeLinecap="round" d="M10 19.5 9 22l3-1.3 3 1.3-1-2.5" />
    </svg>
  );
}

function CoachesIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="3.2" />
      <path strokeLinecap="round" d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" />
    </svg>
  );
}
