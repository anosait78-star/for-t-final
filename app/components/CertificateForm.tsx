"use client";

import { useActionState } from "react";
import { ImageUploadField } from "@/app/components/ImageUploadField";
import type { CertificateFormState } from "@/app/lib/actions/certificates";
import type { Dictionary } from "@/app/lib/i18n/dictionaries";

export function CertificateForm({
  action,
  dict,
  foundations,
  courseNames,
  defaultValues,
}: {
  action: (
    state: CertificateFormState,
    formData: FormData
  ) => Promise<CertificateFormState>;
  dict: Dictionary;
  foundations: { id: number; name: string }[];
  courseNames: string[];
  defaultValues?: {
    studentName: string;
    courseName: string;
    nationalNumber: string;
    country: string;
    accreditedFoundationId: number;
    studentPictureUrl: string | null;
  };
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4 max-w-lg">
      <div>
        <label className="text-sm font-medium">
          {dict.certificate.studentName}
        </label>
        <input
          type="text"
          name="studentName"
          required
          defaultValue={defaultValues?.studentName}
          className="input mt-1"
        />
      </div>
      <div>
        <label className="text-sm font-medium">{dict.admin.courseName}</label>
        <input
          type="text"
          name="courseName"
          list="course-names"
          required
          defaultValue={defaultValues?.courseName}
          className="input mt-1"
        />
        <datalist id="course-names">
          {courseNames.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
      </div>
      <div>
        <label className="text-sm font-medium">
          {dict.certificate.nationalNumber}
        </label>
        <input
          type="text"
          name="nationalNumber"
          required
          pattern="\d{14}"
          title={dict.admin.nationalNumberInvalid}
          defaultValue={defaultValues?.nationalNumber}
          className="input mt-1"
        />
      </div>
      <div>
        <label className="text-sm font-medium">{dict.admin.country}</label>
        <input
          type="text"
          name="country"
          defaultValue={defaultValues?.country ?? "Egypt"}
          className="input mt-1"
        />
      </div>
      <div>
        <label className="text-sm font-medium">
          {dict.certificate.foundation}
        </label>
        <select
          name="accreditedFoundationId"
          required
          defaultValue={defaultValues?.accreditedFoundationId}
          className="input mt-1"
        >
          <option value="">{dict.admin.selectFoundation}</option>
          {foundations.map((foundation) => (
            <option key={foundation.id} value={foundation.id}>
              {foundation.name}
            </option>
          ))}
        </select>
      </div>
      <ImageUploadField
        name="studentPictureUrl"
        label={dict.admin.studentPicture}
        defaultUrl={defaultValues?.studentPictureUrl}
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
