import Image from "next/image";
import { PlaceholderImage } from "@/app/components/PlaceholderImage";
import type { Dictionary, Locale } from "@/app/lib/i18n/dictionaries";

type CertificateData = {
  certificateCode: string;
  studentName: string;
  courseName: string;
  nationalNumber: string;
  date: Date;
  country: string;
  studentPictureUrl: string | null;
  accreditedFoundation: { name: string };
};

export function CertificateDocument({
  certificate,
  dict,
  locale,
}: {
  certificate: CertificateData;
  dict: Dictionary;
  locale: Locale;
}) {
  const formattedDate = certificate.date.toLocaleDateString(
    locale === "ar" ? "ar-EG" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <div className="relative mx-auto max-w-3xl">
      {/* outer gold frame */}
      <div className="rounded-md bg-gradient-to-br from-gold-500 via-gold-400 to-gold-600 p-[3px] shadow-xl shadow-navy-900/10">
        <div className="rounded-[5px] border border-gold-400/60 bg-white p-1">
          {/* inner hairline frame */}
          <div className="relative overflow-hidden rounded-[3px] border-2 border-navy-900/80 px-6 py-10 sm:px-14 sm:py-14">
            <GuillochePattern />

            <PlaceholderImage
              src={certificate.studentPictureUrl}
              alt={certificate.studentName}
              className="absolute end-6 top-6 h-16 w-16 rounded-full border-2 border-gold-400 object-cover shadow-md sm:end-10 sm:top-10 sm:h-20 sm:w-20"
            />

            <Image
              src="/logo.png"
              alt=""
              aria-hidden
              width={340}
              height={340}
              className="pointer-events-none absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 opacity-[0.05] sm:h-[340px] sm:w-[340px]"
            />

            <div className="relative flex flex-col items-center text-center">
              <Image
                src="/logo.png"
                alt="FOR T"
                width={64}
                height={64}
                className="mb-3 h-16 w-16 rounded-full border border-gold-400 bg-white object-contain p-1.5"
              />
              <div className="mb-1 font-serif-display text-lg font-semibold tracking-wide text-navy-900">
                {dict.siteName}
              </div>
              <div className="mb-6 text-[10px] uppercase tracking-[0.25em] text-gold-600">
                {dict.tagline}
              </div>

              <div className="mb-1 h-px w-16 bg-gold-500" />
              <h1 className="font-serif-display my-4 text-3xl font-semibold text-navy-900 sm:text-4xl">
                {dict.certificate.certificateOf}
              </h1>
              <div className="mb-8 h-px w-16 bg-gold-500" />

              <p className="text-sm text-slate-500">{dict.certificate.certifies}</p>
              <p className="font-serif-display my-3 text-3xl font-semibold text-navy-900 sm:text-4xl">
                {certificate.studentName}
              </p>

              <p className="max-w-lg text-sm leading-relaxed text-slate-600">
                {dict.certificate.completed}{" "}
                <span className="font-semibold text-navy-900">
                  {certificate.courseName}
                </span>
                , {dict.certificate.underAccreditation}{" "}
                <span className="font-semibold text-navy-900">
                  {certificate.accreditedFoundation.name}
                </span>
                .
              </p>

              <div className="mt-10 grid w-full max-w-md grid-cols-2 gap-x-8 gap-y-3 border-t border-hairline pt-6 text-start text-xs sm:text-sm">
                <Detail label={dict.certificate.nationalNumber} value={certificate.nationalNumber} />
                <Detail label={dict.certificate.issuedOn} value={formattedDate} />
                <Detail label={dict.certificate.country} value={certificate.country} />
                <Detail label={dict.certificate.code} value={certificate.certificateCode} mono />
              </div>

              <div className="mt-10 flex w-full max-w-md items-end justify-between">
                <div className="text-start">
                  <div className="mb-1 font-serif-display text-sm italic text-navy-800">
                    {dict.siteName}
                  </div>
                  <div className="w-28 border-t border-navy-900/40 pt-1 text-[10px] uppercase tracking-wide text-slate-400">
                    {dict.certificate.authorizedBy}
                  </div>
                </div>
                <Seal />
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-slate-400">
        {dict.certificate.verifyNote}{" "}
        <span className="font-medium text-royal-600">for-t.com/certificates</span>
      </p>
    </div>
  );
}

function Detail({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-slate-400">
        {label}
      </div>
      <div className={`font-medium text-navy-900 ${mono ? "font-mono" : ""}`}>
        {value}
      </div>
    </div>
  );
}

function Seal() {
  return (
    <svg viewBox="0 0 100 100" className="h-20 w-20 shrink-0" aria-hidden>
      <defs>
        <linearGradient id="sealGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d1ab4d" />
          <stop offset="50%" stopColor="#b8912f" />
          <stop offset="100%" stopColor="#96731f" />
        </linearGradient>
      </defs>
      <polygon
        points="50,2 61,20 82,15 79,37 98,50 79,63 82,85 61,80 50,98 39,80 18,85 21,63 2,50 21,37 18,15 39,20"
        fill="url(#sealGold)"
      />
      <circle cx="50" cy="50" r="32" fill="none" stroke="white" strokeWidth="1.5" opacity="0.6" />
      <circle cx="50" cy="50" r="26" fill="none" stroke="white" strokeWidth="1" opacity="0.5" />
      <text
        x="50"
        y="46"
        textAnchor="middle"
        fontSize="18"
        fontWeight="700"
        fill="white"
        fontFamily="serif"
      >
        FT
      </text>
      <text
        x="50"
        y="60"
        textAnchor="middle"
        fontSize="6"
        letterSpacing="1"
        fill="white"
        opacity="0.85"
      >
        CERTIFIED
      </text>
    </svg>
  );
}

function GuillochePattern() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.04]"
    >
      <defs>
        <pattern
          id="guilloche"
          width="26"
          height="26"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(0)"
        >
          <circle cx="13" cy="13" r="11" fill="none" stroke="#0b1e3f" strokeWidth="0.6" />
          <circle cx="0" cy="0" r="11" fill="none" stroke="#0b1e3f" strokeWidth="0.6" />
          <circle cx="26" cy="0" r="11" fill="none" stroke="#0b1e3f" strokeWidth="0.6" />
          <circle cx="0" cy="26" r="11" fill="none" stroke="#0b1e3f" strokeWidth="0.6" />
          <circle cx="26" cy="26" r="11" fill="none" stroke="#0b1e3f" strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#guilloche)" />
    </svg>
  );
}
