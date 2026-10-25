import { prisma } from "@/app/lib/db";
import { PlaceholderImage } from "@/app/components/PlaceholderImage";
import { getLocale } from "@/app/lib/i18n/locale";
import { getDictionary } from "@/app/lib/i18n/dictionaries";

export default async function CoursesPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-16">
      <h1 className="font-serif-display mb-6 border-b border-hairline pb-4 text-2xl font-semibold sm:mb-8 sm:text-3xl">
        {dict.courses.title}
      </h1>
      {courses.length === 0 ? (
        <p className="text-slate-500">{dict.courses.empty}</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {courses.map((course) => (
            <div key={course.id} className="card overflow-hidden">
              <PlaceholderImage
                src={course.imageUrl}
                alt={course.name}
                className="h-44 w-full object-cover"
              />
              <div className="p-5">
                <h2 className="font-serif-display mb-1 font-semibold">
                  {course.name}
                </h2>
                <p className="mb-3 text-sm text-slate-500">
                  {course.description}
                </p>
                <span className="font-semibold text-royal-600">
                  {course.price.toString()} {dict.currency}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
