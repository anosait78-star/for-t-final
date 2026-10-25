import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/db";
import { FoundationForm } from "@/app/components/FoundationForm";
import { updateFoundation } from "@/app/lib/actions/foundations";
import { getLocale } from "@/app/lib/i18n/locale";
import { getDictionary } from "@/app/lib/i18n/dictionaries";

export default async function EditFoundationPage(
  props: PageProps<"/admin/foundations/[id]/edit">
) {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const { id } = await props.params;
  const foundation = await prisma.accreditedFoundation.findUnique({
    where: { id: Number(id) },
  });
  if (!foundation) notFound();

  return (
    <div>
      <h1 className="font-serif-display text-2xl font-semibold mb-6">{dict.admin.edit}</h1>
      <FoundationForm
        action={updateFoundation.bind(null, foundation.id)}
        dict={dict}
        defaultValues={{
          name: foundation.name,
          imageUrl: foundation.imageUrl,
        }}
      />
    </div>
  );
}
