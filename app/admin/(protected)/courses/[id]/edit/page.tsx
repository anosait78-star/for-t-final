import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/db";
import { CourseForm } from "@/app/components/CourseForm";
import { updateCourse } from "@/app/lib/actions/courses";
import { getLocale } from "@/app/lib/i18n/locale";
import { getDictionary } from "@/app/lib/i18n/dictionaries";

export default async function EditCoursePage(
  props: PageProps<"/admin/courses/[id]/edit">
) {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const { id } = await props.params;
  const course = await prisma.course.findUnique({
    where: { id: Number(id) },
  });
  if (!course) notFound();

  return (
    <div>
      <h1 className="font-serif-display text-2xl font-semibold mb-6">{dict.admin.edit}</h1>
      <CourseForm
        action={updateCourse.bind(null, course.id)}
        dict={dict}
        defaultValues={{
          name: course.name,
          description: course.description,
          price: course.price.toString(),
          imageUrl: course.imageUrl,
        }}
      />
    </div>
  );
}
