import { CourseForm } from "@/app/components/CourseForm";
import { createCourse } from "@/app/lib/actions/courses";
import { getLocale } from "@/app/lib/i18n/locale";
import { getDictionary } from "@/app/lib/i18n/dictionaries";

export default async function NewCoursePage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <div>
      <h1 className="font-serif-display text-2xl font-semibold mb-6">{dict.admin.addCourse}</h1>
      <CourseForm action={createCourse} dict={dict} />
    </div>
  );
}
