"use client";

import { useActionState } from "react";
import { ImageUploadField } from "@/app/components/ImageUploadField";
import type { CoachFormState } from "@/app/lib/actions/coaches";
import type { Dictionary } from "@/app/lib/i18n/dictionaries";

export function CoachForm({
  action,
  dict,
  defaultValues,
}: {
  action: (
    state: CoachFormState,
    formData: FormData
  ) => Promise<CoachFormState>;
  dict: Dictionary;
  defaultValues?: { name: string; bio: string | null; imageUrl: string | null };
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4 max-w-lg">
      <div>
        <label className="text-sm font-medium">{dict.admin.name}</label>
        <input
          type="text"
          name="name"
          required
          defaultValue={defaultValues?.name}
          className="input mt-1"
        />
      </div>
      <div>
        <label className="text-sm font-medium">{dict.admin.bio}</label>
        <textarea
          name="bio"
          rows={4}
          defaultValue={defaultValues?.bio ?? ""}
          className="input mt-1"
        />
      </div>
      <ImageUploadField
        name="imageUrl"
        label={dict.admin.coachImage}
        defaultUrl={defaultValues?.imageUrl}
        uploadingText={dict.admin.uploading}
        uploadFailedText={dict.admin.uploadFailed}
        previewAlt={dict.admin.preview}
      />
      {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="btn-gold disabled:opacity-60"
      >
        {pending ? dict.admin.saving : dict.admin.save}
      </button>
    </form>
  );
}
