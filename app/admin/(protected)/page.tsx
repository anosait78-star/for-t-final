import { prisma } from "@/app/lib/db";
import { getLocale } from "@/app/lib/i18n/locale";
import { getDictionary } from "@/app/lib/i18n/dictionaries";

export default async function AdminDashboardPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const [coachCount, certificateCount, students, courseNames] =
    await Promise.all([
      prisma.coach.count(),
      prisma.certificate.count(),
      prisma.certificate.findMany({
        select: { nationalNumber: true },
        distinct: ["nationalNumber"],
      }),
      prisma.certificate.findMany({
        select: { courseName: true },
        distinct: ["courseName"],
      }),
    ]);

  const stats = [
    { label: dict.admin.stats.coaches, value: coachCount },
    { label: dict.admin.stats.certificates, value: certificateCount },
    { label: dict.admin.stats.students, value: students.length },
    { label: dict.admin.stats.courseNames, value: courseNames.length },
  ];

  return (
    <div>
      <h1 className="font-serif-display mb-6 text-2xl font-semibold">
        {dict.admin.dashboard}
      </h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card border-t-2 border-t-gold-500 p-5">
            <div className="font-serif-display text-3xl font-semibold text-navy-900">
              {stat.value}
            </div>
            <div className="mt-1 text-sm text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
