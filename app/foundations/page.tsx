import { prisma } from "@/app/lib/db";
import { PlaceholderImage } from "@/app/components/PlaceholderImage";
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
        <div className="grid grid-cols-2 items-center gap-4 sm:grid-cols-4 sm:gap-8">
          {foundations.map((foundation) => (
            <div key={foundation.id} className="card p-4 text-center sm:p-6">
              <PlaceholderImage
                src={foundation.imageUrl}
                alt={foundation.name}
                className="mx-auto mb-2 h-16 object-contain sm:h-20"
              />
              <p className="text-sm text-slate-600">{foundation.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
