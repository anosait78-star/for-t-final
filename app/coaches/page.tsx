import { prisma } from "@/app/lib/db";
import { PlaceholderImage } from "@/app/components/PlaceholderImage";
import { getLocale } from "@/app/lib/i18n/locale";
import { getDictionary } from "@/app/lib/i18n/dictionaries";

export default async function CoachesPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const coaches = await prisma.coach.findMany({
    orderBy: { createdAt: "desc" },
    take: 15,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="font-serif-display mb-8 border-b border-hairline pb-4 text-3xl font-semibold">
        {dict.coaches.title}
      </h1>
      {coaches.length === 0 ? (
        <p className="text-slate-500">{dict.coaches.empty}</p>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:grid-cols-4">
          {coaches.map((coach) => (
            <div key={coach.id} className="text-center">
              <PlaceholderImage
                src={coach.imageUrl}
                alt={coach.name}
                className="mx-auto mb-3 h-36 w-36 rounded-full border-2 border-gold-400 object-cover"
              />
              <h2 className="font-serif-display font-semibold">
                {coach.name}
              </h2>
              {coach.bio && (
                <p className="mt-1 line-clamp-3 text-sm text-slate-500">
                  {coach.bio}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
