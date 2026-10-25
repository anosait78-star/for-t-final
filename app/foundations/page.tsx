import { prisma } from "@/app/lib/db";
import { getLocale } from "@/app/lib/i18n/locale";
import { getDictionary } from "@/app/lib/i18n/dictionaries";

export default async function FoundationsPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const foundations = await prisma.accreditedFoundation.findMany({
    orderBy: { createdAt: "desc" },
    take: 15,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="font-serif-display mb-8 border-b border-hairline pb-4 text-3xl font-semibold">
        {dict.foundations.title}
      </h1>
      {foundations.length === 0 ? (
        <p className="text-slate-500">{dict.foundations.empty}</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
          {foundations.map((foundation) => (
            <FoundationCard key={foundation.id} name={foundation.name} />
          ))}
        </div>
      )}
    </div>
  );
}

function FoundationCard({ name }: { name: string }) {
  const initial = name.trim().charAt(0).toUpperCase();
  return (
    <div className="card flex flex-col items-center gap-3 p-6 text-center transition-shadow hover:shadow-md">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-navy-900 font-serif-display text-xl font-semibold text-gold-400">
        {initial}
      </span>
      <p className="font-serif-display font-semibold text-navy-900">{name}</p>
    </div>
  );
}
