import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { verifySession } from "@/app/lib/session";
import { logout } from "@/app/lib/actions/auth";
import { getLocale } from "@/app/lib/i18n/locale";
import { getDictionary } from "@/app/lib/i18n/dictionaries";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();
  if (!session) {
    redirect("/admin/login");
  }

  const locale = await getLocale();
  const dict = getDictionary(locale);

  const links = [
    { href: "/admin", label: dict.admin.dashboard },
    { href: "/admin/courses", label: dict.nav.courses },
    { href: "/admin/coaches", label: dict.nav.coaches },
    { href: "/admin/foundations", label: dict.nav.foundations },
    { href: "/admin/certificates", label: dict.admin.certificates },
  ];

  return (
    <div className="flex min-h-[calc(100vh-8rem)]">
      <aside className="flex w-60 shrink-0 flex-col gap-1 border-e border-navy-800 bg-navy-900 p-4 text-white">
        <div className="mb-4 flex items-center gap-2 px-2 pb-4 border-b border-white/10">
          <Image
            src="/logo.png"
            alt="FOR T"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full bg-white/95 object-contain p-1"
          />
          <span className="font-serif-display font-semibold">
            {dict.siteName}
          </span>
        </div>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-md border-s-2 border-transparent px-3 py-2 text-slate-200 transition-colors hover:border-gold-500 hover:bg-white/5 hover:text-white"
          >
            {link.label}
          </Link>
        ))}
        <form action={logout} className="mt-auto pt-4">
          <button
            type="submit"
            className="w-full rounded-md px-3 py-2 text-start text-red-300 hover:bg-white/5"
          >
            {dict.admin.logout}
          </button>
        </form>
      </aside>
      <div className="flex-1 bg-paper p-6">{children}</div>
    </div>
  );
}
