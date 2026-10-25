"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/app/lib/db";
import { verifySession } from "@/app/lib/session";
import { getLocale } from "@/app/lib/i18n/locale";
import { getDictionary, type Dictionary } from "@/app/lib/i18n/dictionaries";

function foundationSchema(dict: Dictionary) {
  return z.object({
    name: z.string().min(2, dict.admin.nameRequired),
    imageUrl: z.string().optional(),
  });
}

export type FoundationFormState = { error?: string } | undefined;

export async function createFoundation(
  _prevState: FoundationFormState,
  formData: FormData
): Promise<FoundationFormState> {
  const dict = getDictionary(await getLocale());
  const session = await verifySession();
  if (!session) return { error: dict.admin.unauthorized };

  const parsed = foundationSchema(dict).safeParse({
    name: formData.get("name"),
    imageUrl: formData.get("imageUrl"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? dict.admin.invalidData };
  }

  await prisma.accreditedFoundation.create({
    data: {
      name: parsed.data.name,
      imageUrl: parsed.data.imageUrl || null,
    },
  });

  revalidatePath("/admin/foundations");
  revalidatePath("/foundations");
  revalidatePath("/");
  redirect("/admin/foundations");
}

export async function updateFoundation(
  id: number,
  _prevState: FoundationFormState,
  formData: FormData
): Promise<FoundationFormState> {
  const dict = getDictionary(await getLocale());
  const session = await verifySession();
  if (!session) return { error: dict.admin.unauthorized };

  const parsed = foundationSchema(dict).safeParse({
    name: formData.get("name"),
    imageUrl: formData.get("imageUrl"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? dict.admin.invalidData };
  }

  await prisma.accreditedFoundation.update({
    where: { id },
    data: {
      name: parsed.data.name,
      imageUrl: parsed.data.imageUrl || null,
    },
  });

  revalidatePath("/admin/foundations");
  revalidatePath("/foundations");
  revalidatePath("/");
  redirect("/admin/foundations");
}

export type DeleteFoundationResult = { error: string } | undefined;

export async function deleteFoundation(
  id: number
): Promise<DeleteFoundationResult> {
  const dict = getDictionary(await getLocale());
  const session = await verifySession();
  if (!session) return { error: dict.admin.unauthorized };

  try {
    await prisma.accreditedFoundation.delete({ where: { id } });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2003"
    ) {
      return { error: dict.admin.cannotDeleteFoundation };
    }
    throw err;
  }

  revalidatePath("/admin/foundations");
  revalidatePath("/foundations");
  revalidatePath("/");
}
