"use client";

import { useActionState } from "react";
import { login } from "@/app/lib/actions/auth";
import type { Dictionary } from "@/app/lib/i18n/dictionaries";

export function LoginForm({ dict }: { dict: Dictionary }) {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input
        type="email"
        name="email"
        placeholder={dict.admin.email}
        required
        className="input py-3"
      />
      <input
        type="password"
        name="password"
        placeholder={dict.admin.password}
        required
        className="input py-3"
      />
      {state?.error && (
        <p className="text-red-600 text-sm text-center">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="btn-gold disabled:opacity-60"
      >
        {pending ? dict.admin.loggingIn : dict.admin.loginButton}
      </button>
    </form>
  );
}
