"use client";

import { useActionState } from "react";
import type { DeleteFoundationResult } from "@/app/lib/actions/foundations";

export function DeleteFoundationButton({
  action,
  label = "Delete",
  confirmMessage = "Are you sure?",
}: {
  action: (
    state: DeleteFoundationResult
  ) => Promise<DeleteFoundationResult>;
  label?: string;
  confirmMessage?: string;
}) {
  const [state, formAction, pending] = useActionState(
    async (state: DeleteFoundationResult) => action(state),
    undefined
  );

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
      className="flex flex-col items-end gap-1"
    >
      <button
        type="submit"
        disabled={pending}
        className="text-red-600 hover:underline disabled:opacity-60"
      >
        {label}
      </button>
      {state?.error && (
        <span className="text-xs text-red-600">{state.error}</span>
      )}
    </form>
  );
}
