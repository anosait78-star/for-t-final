"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/db";
import { verifySession } from "@/app/lib/session";
import { getLocale } from "@/app/lib/i18n/locale";
import { getDictionary, type Dictionary } from "@/app/lib/i18n/dictionaries";

function coachSchema(dict: Dictionary) {
  return z.object({
    name: z.string().min(2, dict.admin.nameRequired),
    bio: z.string().max(700, dict.admin.bioTooLong).optional(),
    imageUrl: z.string().optional(),
  });
}

export type CoachFormState = { error?: string } | undefined;

export async function createCoach(
  _prevState: CoachFormState,
  formData: FormData
): Promise<CoachFormState> {
  const dict = getDictionary(await getLocale());
  const session = await verifySession();
  if (!session) return { error: dict.admin.unauthorized };

  const parsed = coachSchema(dict).safeParse({
    name: formData.get("name"),
    bio: formData.get("bio"),
    imageUrl: formData.get("imageUrl"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? dict.admin.invalidData };
  }

  await prisma.coach.create({
    data: {
      name: parsed.data.name,
      bio: parsed.data.bio || null,
      imageUrl: parsed.data.imageUrl || null,
    },
  });

  revalidatePath("/admin/coaches");
  revalidatePath("/coaches");
  revalidatePath("/");
  redirect("/admin/coaches");
}

export async function updateCoach(
  id: number,
  _prevState: CoachFormState,
  formData: FormData
): Promise<CoachFormState> {
  const dict = getDictionary(await getLocale());
  const session = await verifySession();
  if (!session) return { error: dict.admin.unauthorized };

  const parsed = coachSchema(dict).safeParse({
    name: formData.get("name"),
    bio: formData.get("bio"),
    imageUrl: formData.get("imageUrl"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? dict.admin.invalidData };
  }

  await prisma.coach.update({
    where: { id },
    data: {
      name: parsed.data.name,
      bio: parsed.data.bio || null,
      imageUrl: parsed.data.imageUrl || null,
    },
  });

  revalidatePath("/admin/coaches");
  revalidatePath("/coaches");
  revalidatePath("/");
  redirect("/admin/coaches");
}

export async function deleteCoach(id: number) {
  const dict = getDictionary(await getLocale());
  const session = await verifySession();
  if (!session) throw new Error(dict.admin.unauthorized);

  await prisma.coach.delete({ where: { id } });

  revalidatePath("/admin/coaches");
  revalidatePath("/coaches");
  revalidatePath("/");
}
