import { prisma } from "@/app/lib/db";
import { getLocale } from "@/app/lib/i18n/locale";
import { getDictionary } from "@/app/lib/i18n/dictionaries";
import { CertificateDocument } from "@/app/components/CertificateDocument";

export default async function CertificateSearchPage(
  props: PageProps<"/certificates">
) {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const { code } = await props.searchParams;
  const trimmedCode = typeof code === "string" ? code.trim() : "";
  const normalizedCode = trimmedCode.toUpperCase();

  const certificate = normalizedCode
    ? await prisma.certificate.findUnique({
        where: { certificateCode: normalizedCode },
        include: { accreditedFoundation: true },
      })
    : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-16">
      <h1 className="font-serif-display mb-2 text-center text-2xl font-semibold sm:text-3xl">
        {dict.certificate.title}
      </h1>
      <p className="mb-6 text-center text-sm text-slate-500 sm:mb-8 sm:text-base">
        {dict.certificate.subtitle}
      </p>

      <form className="mx-auto mb-8 flex max-w-2xl flex-col gap-2 sm:mb-10 sm:flex-row">
        <input
          type="text"
          name="code"
          defaultValue={trimmedCode}
          placeholder={dict.certificate.placeholder}
          required
          className="input flex-1 py-3"
        />
        <button type="submit" className="btn-gold shrink-0">
          {dict.certificate.search}
        </button>
      </form>

      {trimmedCode && !certificate && (
        <div className="mx-auto max-w-2xl rounded-md border border-red-200 bg-red-50 p-6 text-center text-red-700">
          {dict.certificate.notFound}
        </div>
      )}

      {certificate && (
        <CertificateDocument certificate={certificate} dict={dict} locale={locale} />
      )}
    </div>
  );
}
