"use client";

import { useState } from "react";

export function ImageUploadField({
  name,
  label,
  defaultUrl,
  uploadingText = "Uploading...",
  uploadFailedText = "Failed to upload image.",
  previewAlt = "Preview",
}: {
  name: string;
  label: string;
  defaultUrl?: string | null;
  uploadingText?: string;
  uploadFailedText?: string;
  previewAlt?: string;
}) {
  const [url, setUrl] = useState(defaultUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? uploadFailedText);
        return;
      }
      setUrl(data.url);
    } catch {
      setError(uploadFailedText);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">{label}</label>
      <input type="hidden" name={name} value={url} />
      <input
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        onChange={handleFileChange}
        className="text-sm"
      />
      {uploading && <p className="text-sm text-slate-500">{uploadingText}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={previewAlt}
          className="h-24 w-24 rounded-md border border-hairline object-cover"
        />
      )}
    </div>
  );
}
