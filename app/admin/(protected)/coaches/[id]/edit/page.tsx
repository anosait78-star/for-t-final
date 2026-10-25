import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/db";
import { CoachForm } from "@/app/components/CoachForm";
import { updateCoach } from "@/app/lib/actions/coaches";
import { getLocale } from "@/app/lib/i18n/locale";
import { getDictionary } from "@/app/lib/i18n/dictionaries";

export default async function EditCoachPage(
  props: PageProps<"/admin/coaches/[id]/edit">
) {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const { id } = await props.params;
  const coach = await prisma.coach.findUnique({ where: { id: Number(id) } });
  if (!coach) notFound();

  return (
    <div>
      <h1 className="font-serif-display text-2xl font-semibold mb-6">{dict.admin.edit}</h1>
      <CoachForm
        action={updateCoach.bind(null, coach.id)}
        dict={dict}
        defaultValues={{
          name: coach.name,
          bio: coach.bio,
          imageUrl: coach.imageUrl,
        }}
      />
    </div>
  );
}
