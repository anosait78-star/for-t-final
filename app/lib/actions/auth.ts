"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { createSession, deleteSession } from "@/app/lib/session";
import { getLocale } from "@/app/lib/i18n/locale";
import { getDictionary } from "@/app/lib/i18n/dictionaries";

export type LoginState = { error?: string } | undefined;

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const dict = getDictionary(await getLocale());
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail || !adminPasswordHash) {
    return { error: dict.admin.adminNotConfigured };
  }

  if (!email || !password) {
    return { error: dict.admin.enterEmailAndPassword };
  }

  const emailMatches = email.toLowerCase() === adminEmail.toLowerCase();
  const passwordMatches = await bcrypt.compare(password, adminPasswordHash);

  if (!emailMatches || !passwordMatches) {
    return { error: dict.admin.invalidCredentials };
  }

  await createSession(adminEmail);
  redirect("/admin");
}

export async function logout() {
  "use server";
  await deleteSession();
  redirect("/admin/login");
}
