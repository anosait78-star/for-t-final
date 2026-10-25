import Link from "next/link";
import { prisma } from "@/app/lib/db";
import { DeleteButton } from "@/app/components/DeleteButton";
import { deleteCertificate } from "@/app/lib/actions/certificates";
import { getLocale } from "@/app/lib/i18n/locale";
import { getDictionary } from "@/app/lib/i18n/dictionaries";

export default async function AdminCertificatesPage(
  props: PageProps<"/admin/certificates">
) {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const { q } = await props.searchParams;
  const query = typeof q === "string" ? q.trim() : "";

  const certificates = await prisma.certificate.findMany({
    where: query ? { nationalNumber: { contains: query } } : undefined,
    orderBy: { date: "desc" },
    take: 15,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif-display text-2xl font-semibold">{dict.admin.certificates}</h1>
        <Link
          href="/admin/certificates/new"
          className="btn-gold px-4 py-2"
        >
          {dict.admin.addCertificate}
        </Link>
      </div>

      <form className="mb-4">
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder={dict.admin.searchByNationalNumber}
          className="input max-w-xs"
        />
      </form>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-navy-900/5 text-right">
            <tr>
              <th className="p-3">{dict.certificate.code}</th>
              <th className="p-3">{dict.certificate.studentName}</th>
              <th className="p-3">{dict.certificate.course}</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((certificate) => (
              <tr
                key={certificate.certificateCode}
                className="border-t border-hairline"
              >
                <td className="p-3 font-mono text-xs">
                  {certificate.certificateCode}
                </td>
                <td className="p-3">{certificate.studentName}</td>
                <td className="p-3">{certificate.courseName}</td>
                <td className="p-3 flex gap-3 justify-end">
                  <Link
                    href={`/admin/certificates/${certificate.certificateCode}/edit`}
                    className="text-royal-600 hover:underline"
                  >
                    {dict.admin.edit}
                  </Link>
                  <DeleteButton
                    action={deleteCertificate.bind(
                      null,
                      certificate.certificateCode
                    )}
                    confirmMessage={dict.admin.confirmDelete}
                    label={dict.admin.delete}
                  />
                </td>
              </tr>
            ))}
            {certificates.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-slate-500">
                  {dict.admin.noCertificates}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
