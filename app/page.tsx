import Link from "next/link";
import { prisma } from "@/app/lib/db";
import { PlaceholderImage } from "@/app/components/PlaceholderImage";
import { PersonAvatar } from "@/app/components/PersonAvatar";
import { getLocale } from "@/app/lib/i18n/locale";
import { getDictionary } from "@/app/lib/i18n/dictionaries";

export default async function HomePage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const [coaches, foundations, courses, foundationCount, certificateCount, coachCount] =
    await Promise.all([
      prisma.coach.findMany({ orderBy: { createdAt: "desc" }, take: 3 }),
      prisma.accreditedFoundation.findMany({
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
      prisma.course.findMany({ orderBy: { createdAt: "desc" }, take: 3 }),
      prisma.accreditedFoundation.count(),
      prisma.certificate.count(),
      prisma.coach.count(),
    ]);

  const credibility = [
    { value: foundationCount, label: dict.home.credibilityFoundations },
    { value: certificateCount, label: dict.home.credibilityCertificates },
    { value: coachCount, label: dict.home.credibilityCoaches },
  ];

  return (
    <div>
      <section className="relative overflow-hidden bg-navy-900 text-white">
        <EmblemWatermark />
        <div className="relative mx-auto max-w-6xl px-4 py-14 text-center sm:py-24">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-400 sm:mb-4 sm:text-xs sm:tracking-[0.25em]">
            {dict.home.heroEyebrow}
          </p>
          <h1 className="font-serif-display mx-auto mb-5 max-w-3xl text-3xl font-semibold leading-tight sm:mb-6 sm:text-5xl">
            {dict.home.heroTitle}
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-sm text-slate-300 sm:mb-10 sm:text-base">
            {dict.home.heroSubtitle}
          </p>
          <Link
            href="/courses"
            className="inline-block w-full rounded-md bg-gold-500 px-7 py-3.5 font-semibold text-navy-950 transition-colors hover:bg-gold-400 sm:w-auto sm:py-3"
          >
            {dict.home.browseCourses}
          </Link>
        </div>

        {/* mobile: horizontally scrollable stat chips instead of a cramped 3-col grid */}
        <div className="relative border-t border-white/10 bg-navy-950/60">
          <div className="mx-auto flex max-w-6xl snap-x gap-px overflow-x-auto px-4 sm:grid sm:grid-cols-3 sm:divide-x sm:divide-white/10 sm:overflow-visible sm:px-4 rtl:sm:divide-x-reverse">
            {credibility.map((stat) => (
              <div
                key={stat.label}
                className="shrink-0 snap-start basis-1/3 px-4 py-6 text-center sm:basis-auto sm:py-8"
              >
                <div className="font-serif-display text-2xl font-semibold text-gold-400 sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-[11px] uppercase tracking-wide text-slate-300 sm:text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:mx-auto sm:max-w-6xl sm:px-4 sm:py-16">
        <div className="px-4 sm:px-0">
          <SectionHeading title={dict.home.latestCourses} href="/courses" viewAll={dict.home.viewAll} />
        </div>
        {courses.length === 0 ? (
          <p className="px-4 text-slate-500 sm:px-0">{dict.home.noCourses}</p>
        ) : (
          <>
            {/* mobile: horizontal snap carousel, built for touch — not a shrunk grid */}
            <div className="flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:hidden">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="card w-[78%] shrink-0 snap-start overflow-hidden"
                >
                  <PlaceholderImage
                    src={course.imageUrl}
                    alt={course.name}
                    className="h-36 w-full object-cover"
                  />
                  <div className="p-4">
                    <h3 className="mb-1 font-serif-display font-semibold">
                      {course.name}
                    </h3>
                    <p className="mb-3 line-clamp-2 text-sm text-slate-500">
                      {course.description}
                    </p>
                    <span className="font-semibold text-royal-600">
                      {course.price.toString()} {dict.currency}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden grid-cols-1 gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <div key={course.id} className="card overflow-hidden">
                  <PlaceholderImage
                    src={course.imageUrl}
                    alt={course.name}
                    className="h-40 w-full object-cover"
                  />
                  <div className="p-5">
                    <h3 className="mb-1 font-serif-display font-semibold">
                      {course.name}
                    </h3>
                    <p className="mb-3 line-clamp-2 text-sm text-slate-500">
                      {course.description}
                    </p>
                    <span className="font-semibold text-royal-600">
                      {course.price.toString()} {dict.currency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="bg-white py-12 sm:py-16">
        <div className="px-4 sm:mx-auto sm:max-w-6xl">
          <SectionHeading title={dict.home.ourCoaches} href="/coaches" viewAll={dict.home.viewAll} />
          {coaches.length === 0 ? (
            <p className="text-slate-500">{dict.home.noCoaches}</p>
          ) : (
            <>
              {/* mobile: horizontal scroll of coach cards */}
              <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:hidden">
                {coaches.map((coach) => (
                  <div key={coach.id} className="w-28 shrink-0 snap-start text-center">
                    <PersonAvatar
                      src={coach.imageUrl}
                      alt={coach.name}
                      className="mx-auto mb-2 h-24 w-24 rounded-full border-2 border-gold-400 object-cover"
                    />
                    <h3 className="font-serif-display text-sm font-semibold leading-tight">
                      {coach.name}
                    </h3>
                  </div>
                ))}
              </div>

              <div className="hidden grid-cols-3 gap-6 sm:grid">
                {coaches.map((coach) => (
                  <div key={coach.id} className="text-center">
                    <PersonAvatar
                      src={coach.imageUrl}
                      alt={coach.name}
                      className="mx-auto mb-3 h-32 w-32 rounded-full border-2 border-gold-400 object-cover"
                    />
                    <h3 className="font-serif-display font-semibold">
                      {coach.name}
                    </h3>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <SectionHeading
          title={dict.home.accreditedFoundations}
          href="/foundations"
          viewAll={dict.home.viewAll}
        />
        {foundations.length === 0 ? (
          <p className="text-slate-500">{dict.home.noFoundations}</p>
        ) : (
          <div className="grid grid-cols-3 items-center gap-4 sm:grid-cols-3 sm:gap-6">
            {foundations.map((foundation) => (
              <div key={foundation.id} className="text-center">
                <PlaceholderImage
                  src={foundation.imageUrl}
                  alt={foundation.name}
                  className="mx-auto mb-2 h-16 object-contain"
                />
                <p className="text-sm text-slate-600">{foundation.name}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function SectionHeading({
  title,
  href,
  viewAll,
}: {
  title: string;
  href: string;
  viewAll: string;
}) {
  return (
    <div className="mb-8 flex items-center justify-between border-b border-hairline pb-4">
      <h2 className="font-serif-display text-2xl font-semibold">{title}</h2>
      <Link href={href} className="text-sm font-medium text-royal-600 hover:underline">
        {viewAll}
      </Link>
    </div>
  );
}

function EmblemWatermark() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute -right-16 -top-16 h-[220px] w-[220px] text-white/5 sm:-right-24 sm:-top-24 sm:h-[420px] sm:w-[420px] rtl:-right-auto rtl:-left-16 sm:rtl:-left-24"
      viewBox="0 0 200 200"
      fill="none"
    >
      <path
        d="M100 10 L170 40 V95 C170 140 140 170 100 190 C60 170 30 140 30 95 V40 Z"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M100 40 L140 58 V92 C140 120 122 142 100 155 C78 142 60 120 60 92 V58 Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="100" cy="90" r="14" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
