import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/db";
import { CertificateForm } from "@/app/components/CertificateForm";
import { updateCertificate } from "@/app/lib/actions/certificates";
import { getLocale } from "@/app/lib/i18n/locale";
import { getDictionary } from "@/app/lib/i18n/dictionaries";

export default async function EditCertificatePage(
  props: PageProps<"/admin/certificates/[code]/edit">
) {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const { code } = await props.params;

  const [certificate, foundations, courses] = await Promise.all([
    prisma.certificate.findUnique({ where: { certificateCode: code } }),
    prisma.accreditedFoundation.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.course.findMany({
      orderBy: { name: "asc" },
      select: { name: true },
    }),
  ]);

  if (!certificate) notFound();

  return (
    <div>
      <h1 className="font-serif-display text-2xl font-semibold mb-6">{dict.admin.edit}</h1>
      <CertificateForm
        action={updateCertificate.bind(null, certificate.certificateCode)}
        dict={dict}
        foundations={foundations}
        courseNames={courses.map((c) => c.name)}
        defaultValues={{
          studentName: certificate.studentName,
          courseName: certificate.courseName,
          nationalNumber: certificate.nationalNumber,
          country: certificate.country,
          accreditedFoundationId: certificate.accreditedFoundationId,
          studentPictureUrl: certificate.studentPictureUrl,
        }}
      />
    </div>
  );
}
