import { CoachForm } from "@/app/components/CoachForm";
import { createCoach } from "@/app/lib/actions/coaches";
import { getLocale } from "@/app/lib/i18n/locale";
import { getDictionary } from "@/app/lib/i18n/dictionaries";

export default async function NewCoachPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <div>
      <h1 className="font-serif-display text-2xl font-semibold mb-6">{dict.admin.addCoach}</h1>
      <CoachForm action={createCoach} dict={dict} />
    </div>
  );
}
