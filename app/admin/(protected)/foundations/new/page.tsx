import { FoundationForm } from "@/app/components/FoundationForm";
import { createFoundation } from "@/app/lib/actions/foundations";
import { getLocale } from "@/app/lib/i18n/locale";
import { getDictionary } from "@/app/lib/i18n/dictionaries";

export default async function NewFoundationPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <div>
      <h1 className="font-serif-display text-2xl font-semibold mb-6">{dict.admin.addFoundation}</h1>
      <FoundationForm action={createFoundation} dict={dict} />
    </div>
  );
}
