import { prisma } from "@/app/lib/db";
import { CertificateForm } from "@/app/components/CertificateForm";
import { createCertificate } from "@/app/lib/actions/certificates";
import { getLocale } from "@/app/lib/i18n/locale";
import { getDictionary } from "@/app/lib/i18n/dictionaries";

export default async function NewCertificatePage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const [foundations, courses] = await Promise.all([
    prisma.accreditedFoundation.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.course.findMany({
      orderBy: { name: "asc" },
      select: { name: true },
    }),
  ]);

  return (
    <div>
      <h1 className="font-serif-display text-2xl font-semibold mb-6">{dict.admin.addCertificate}</h1>
      <CertificateForm
        action={createCertificate}
        dict={dict}
        foundations={foundations}
        courseNames={courses.map((c) => c.name)}
      />
    </div>
  );
}
