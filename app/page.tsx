import Link from "next/link";
import { prisma } from "@/app/lib/db";
import { PlaceholderImage } from "@/app/components/PlaceholderImage";
import { PersonAvatar } from "@/app/components/PersonAvatar";
import { getLocale } from "@/app/lib/i18n/locale";
import { getDictionary } from "@/app/lib/i18n/dictionaries";
import { COACHES_NAV_ENABLED } from "@/app/lib/site-config";

export default async function HomePage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const [
    coaches,
    foundations,
    courses,
    foundationCount,
    certificateCount,
    coachCount,
    courseCount,
    countryGroups,
    featuredCourse,
  ] = await Promise.all([
    prisma.coach.findMany({ orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.accreditedFoundation.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.course.findMany({ orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.accreditedFoundation.count(),
    prisma.certificate.count(),
    prisma.coach.count(),
    prisma.course.count(),
    prisma.certificate.groupBy({ by: ["country"] }),
    prisma.course.findFirst({ orderBy: { price: "desc" } }),
  ]);

  const countryCount = countryGroups.length;

  const credibility = [
    { value: foundationCount, label: dict.home.credibilityFoundations },
    { value: certificateCount, label: dict.home.credibilityCertificates },
    COACHES_NAV_ENABLED
      ? { value: coachCount, label: dict.home.credibilityCoaches }
      : { value: courseCount, label: dict.home.credibilityCourses },
  ];

  const whyItems = [
    {
      icon: ShieldIcon,
      title: dict.home.whyAccreditedTitle,
      desc: dict.home.whyAccreditedDesc,
    },
    {
      icon: CheckBadgeIcon,
      title: dict.home.whyVerifiableTitle,
      desc: dict.home.whyVerifiableDesc,
    },
    COACHES_NAV_ENABLED
      ? {
          icon: CoachIcon,
          title: dict.home.whyCoachesTitle,
          desc: dict.home.whyCoachesDesc,
        }
      : {
          icon: CoachIcon,
          title: dict.home.whyFlexibleTitle,
          desc: dict.home.whyFlexibleDesc,
        },
    {
      icon: GlobeIcon,
      title: dict.home.whyReachTitle,
      desc:
        countryCount >= 2
          ? dict.home.whyReachDesc.replace("{count}", String(countryCount))
          : dict.home.whyReachDescFallback,
    },
  ];

  const howSteps = [
    { title: dict.home.howStep1Title, desc: dict.home.howStep1Desc },
    { title: dict.home.howStep2Title, desc: dict.home.howStep2Desc },
    { title: dict.home.howStep3Title, desc: dict.home.howStep3Desc },
    { title: dict.home.howStep4Title, desc: dict.home.howStep4Desc },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: dict.siteName,
    description: dict.home.heroSubtitle,
    foundingDate: "2024",
    areaServed: "Worldwide",
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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

      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <h2 className="font-serif-display mb-8 text-center text-2xl font-semibold sm:mb-10 sm:text-3xl">
          {dict.home.whyTitle}
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyItems.map((item) => (
            <div key={item.title} className="card p-6 text-center">
              <item.icon className="mx-auto mb-3 h-9 w-9 text-gold-600" />
              <h3 className="mb-1.5 font-serif-display font-semibold">{item.title}</h3>
              <p className="text-sm leading-relaxed text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {featuredCourse && (
        <section className="bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="card grid grid-cols-1 overflow-hidden sm:grid-cols-2">
              <PlaceholderImage
                src={featuredCourse.imageUrl}
                alt={featuredCourse.name}
                className="h-56 w-full object-cover sm:h-full"
              />
              <div className="flex flex-col justify-center p-6 sm:p-10">
                <span className="mb-3 inline-block w-fit rounded-full bg-gold-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-600">
                  {dict.home.featuredBadge}
                </span>
                <h3 className="font-serif-display mb-3 text-2xl font-semibold sm:text-3xl">
                  {featuredCourse.name}
                </h3>
                <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-slate-500 sm:text-base">
                  {featuredCourse.description}
                </p>
                <div className="flex items-center gap-4">
                  <span className="font-serif-display text-xl font-semibold text-royal-600">
                    {dict.currency}
                    {featuredCourse.price.toString()}
                  </span>
                  <Link href="/courses" className="btn-gold">
                    {dict.home.browseCourses}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <h2 className="font-serif-display mb-8 text-center text-2xl font-semibold sm:mb-10 sm:text-3xl">
          {dict.home.howTitle}
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {howSteps.map((step, i) => (
            <div key={step.title} className="relative text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-navy-900 font-serif-display text-lg font-semibold text-gold-400">
                {i + 1}
              </div>
              <h3 className="mb-1.5 font-serif-display font-semibold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-slate-500">{step.desc}</p>
            </div>
          ))}
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
              {courses.map((course, i) => (
                <div
                  key={course.id}
                  className="card relative w-[78%] shrink-0 snap-start overflow-hidden"
                >
                  {i === 0 && (
                    <span className="absolute start-3 top-3 z-10 rounded-full bg-gold-500 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-navy-950 shadow">
                      {dict.home.newBadge}
                    </span>
                  )}
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
                      {dict.currency}
                      {course.price.toString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden grid-cols-1 gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course, i) => (
                <div key={course.id} className="card relative overflow-hidden">
                  {i === 0 && (
                    <span className="absolute start-3 top-3 z-10 rounded-full bg-gold-500 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-navy-950 shadow">
                      {dict.home.newBadge}
                    </span>
                  )}
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
                      {dict.currency}
                      {course.price.toString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {COACHES_NAV_ENABLED && (
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
                    {coach.bio && (
                      <p className="mx-auto mt-1 line-clamp-2 max-w-xs text-sm text-slate-500">
                        {coach.bio}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <SectionHeading
          title={dict.home.accreditedFoundations}
          href="/foundations"
          viewAll={dict.home.viewAll}
        />
        {foundations.length === 0 ? (
          <p className="text-slate-500">{dict.home.noFoundations}</p>
        ) : (
          <FoundationsMarquee foundations={foundations} />
        )}
      </section>

      <section className="bg-navy-900 text-white">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:py-20">
          <h2 className="font-serif-display mb-3 text-2xl font-semibold sm:text-3xl">
            {dict.home.ctaTitle}
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-sm text-slate-300 sm:text-base">
            {dict.home.ctaSubtitle}
          </p>
          <Link
            href="/courses"
            className="inline-block w-full rounded-md bg-gold-500 px-7 py-3.5 font-semibold text-navy-950 transition-colors hover:bg-gold-400 sm:w-auto sm:py-3"
          >
            {dict.home.ctaButton}
          </Link>
        </div>
      </section>
    </div>
  );
}

function FoundationsMarquee({
  foundations,
}: {
  foundations: { id: number; name: string }[];
}) {
  const track = [...foundations, ...foundations];
  return (
    <div className="marquee-mask overflow-hidden">
      <div className="flex w-max animate-marquee items-center gap-4">
        {track.map((foundation, i) => (
          <div
            key={`${foundation.id}-${i}`}
            className="card flex shrink-0 items-center gap-2.5 px-5 py-3"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-900 font-serif-display text-xs font-semibold text-gold-400">
              {foundation.name.trim().charAt(0).toUpperCase()}
            </span>
            <p className="whitespace-nowrap text-sm font-medium text-navy-900">
              {foundation.name}
            </p>
          </div>
        ))}
      </div>
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

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 4.5 6v6c0 4.4 3.1 7.7 7.5 9 4.4-1.3 7.5-4.6 7.5-9V6L12 3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" />
    </svg>
  );
}

function CheckBadgeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <path strokeLinecap="round" strokeLinejoin="round" d="m12 3 2.2 1.8 2.8-.3 1 2.6 2.6 1-.3 2.8L22 13l-1.8 2.2.3 2.8-2.6 1-1 2.6-2.8-.3L12 23l-2.2-1.8-2.8.3-1-2.6-2.6-1 .3-2.8L2 13l1.8-2.2-.3-2.8 2.6-1 1-2.6 2.8.3L12 3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.5 2 2 4-4.5" />
    </svg>
  );
}

function CoachIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="8" r="3.3" />
      <path strokeLinecap="round" d="M5 20c0-3.7 3.1-6.2 7-6.2s7 2.5 7 6.2" />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3Z" />
    </svg>
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
