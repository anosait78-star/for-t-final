"use server";

import { z } from "zod";
import { randomBytes } from "crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/db";
import { verifySession } from "@/app/lib/session";
import { getLocale } from "@/app/lib/i18n/locale";
import { getDictionary, type Dictionary } from "@/app/lib/i18n/dictionaries";

function certificateSchema(dict: Dictionary) {
  return z.object({
    studentName: z.string().min(2, dict.admin.studentNameRequired),
    courseName: z.string().min(2, dict.admin.courseNameRequired),
    nationalNumber: z
      .string()
      .regex(/^\d{14}$/, dict.admin.nationalNumberInvalid),
    country: z.string().min(2, dict.admin.countryRequired),
    accreditedFoundationId: z.coerce
      .number({ error: dict.admin.selectFoundationRequired })
      .int()
      .positive(dict.admin.selectFoundationRequired),
    studentPictureUrl: z.string().optional(),
  });
}

export type CertificateFormState = { error?: string } | undefined;

async function generateUniqueCertificateCode(
  dict: Dictionary
): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const suffix = randomBytes(4).toString("hex").toUpperCase();
    const code = `CERT${suffix}`;
    const existing = await prisma.certificate.findUnique({
      where: { certificateCode: code },
      select: { certificateCode: true },
    });
    if (!existing) return code;
  }
  throw new Error(dict.admin.generateCodeFailed);
}

export async function createCertificate(
  _prevState: CertificateFormState,
  formData: FormData
): Promise<CertificateFormState> {
  const dict = getDictionary(await getLocale());
  const session = await verifySession();
  if (!session) return { error: dict.admin.unauthorized };

  const parsed = certificateSchema(dict).safeParse({
    studentName: formData.get("studentName"),
    courseName: formData.get("courseName"),
    nationalNumber: formData.get("nationalNumber"),
    country: formData.get("country") || "Egypt",
    accreditedFoundationId: formData.get("accreditedFoundationId"),
    studentPictureUrl: formData.get("studentPictureUrl"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? dict.admin.invalidData };
  }

  const certificateCode = await generateUniqueCertificateCode(dict);

  await prisma.certificate.create({
    data: {
      certificateCode,
      studentName: parsed.data.studentName,
      courseName: parsed.data.courseName,
      nationalNumber: parsed.data.nationalNumber,
      country: parsed.data.country,
      accreditedFoundationId: parsed.data.accreditedFoundationId,
      studentPictureUrl: parsed.data.studentPictureUrl || null,
    },
  });

  revalidatePath("/admin/certificates");
  redirect("/admin/certificates");
}

export async function updateCertificate(
  certificateCode: string,
  _prevState: CertificateFormState,
  formData: FormData
): Promise<CertificateFormState> {
  const dict = getDictionary(await getLocale());
  const session = await verifySession();
  if (!session) return { error: dict.admin.unauthorized };

  const parsed = certificateSchema(dict).safeParse({
    studentName: formData.get("studentName"),
    courseName: formData.get("courseName"),
    nationalNumber: formData.get("nationalNumber"),
    country: formData.get("country") || "Egypt",
    accreditedFoundationId: formData.get("accreditedFoundationId"),
    studentPictureUrl: formData.get("studentPictureUrl"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? dict.admin.invalidData };
  }

  await prisma.certificate.update({
    where: { certificateCode },
    data: {
      studentName: parsed.data.studentName,
      courseName: parsed.data.courseName,
      nationalNumber: parsed.data.nationalNumber,
      country: parsed.data.country,
      accreditedFoundationId: parsed.data.accreditedFoundationId,
      studentPictureUrl: parsed.data.studentPictureUrl || null,
    },
  });

  revalidatePath("/admin/certificates");
  revalidatePath(`/certificates`);
  redirect("/admin/certificates");
}

export async function deleteCertificate(certificateCode: string) {
  const dict = getDictionary(await getLocale());
  const session = await verifySession();
  if (!session) throw new Error(dict.admin.unauthorized);

  await prisma.certificate.delete({ where: { certificateCode } });

  revalidatePath("/admin/certificates");
}
