"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/db";
import { verifySession } from "@/app/lib/session";
import { getLocale } from "@/app/lib/i18n/locale";
import { getDictionary, type Dictionary } from "@/app/lib/i18n/dictionaries";

function courseSchema(dict: Dictionary) {
  return z.object({
    name: z.string().min(2, dict.admin.nameRequired),
    description: z.string().min(2, dict.admin.descriptionRequired),
    price: z.coerce.number().positive(dict.admin.priceInvalid),
    imageUrl: z.string().optional(),
  });
}

export type CourseFormState = { error?: string } | undefined;

export async function createCourse(
  _prevState: CourseFormState,
  formData: FormData
): Promise<CourseFormState> {
  const dict = getDictionary(await getLocale());
  const session = await verifySession();
  if (!session) return { error: dict.admin.unauthorized };

  const parsed = courseSchema(dict).safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    imageUrl: formData.get("imageUrl"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? dict.admin.invalidData };
  }

  await prisma.course.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      price: parsed.data.price,
      imageUrl: parsed.data.imageUrl || null,
    },
  });

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  revalidatePath("/");
  redirect("/admin/courses");
}

export async function updateCourse(
  id: number,
  _prevState: CourseFormState,
  formData: FormData
): Promise<CourseFormState> {
  const dict = getDictionary(await getLocale());
  const session = await verifySession();
  if (!session) return { error: dict.admin.unauthorized };

  const parsed = courseSchema(dict).safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    imageUrl: formData.get("imageUrl"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? dict.admin.invalidData };
  }

  await prisma.course.update({
    where: { id },
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      price: parsed.data.price,
      imageUrl: parsed.data.imageUrl || null,
    },
  });

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  revalidatePath("/");
  redirect("/admin/courses");
}

export async function deleteCourse(id: number) {
  const dict = getDictionary(await getLocale());
  const session = await verifySession();
  if (!session) throw new Error(dict.admin.unauthorized);

  await prisma.course.delete({ where: { id } });

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  revalidatePath("/");
}
