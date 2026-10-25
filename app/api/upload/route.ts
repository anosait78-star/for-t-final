import { NextResponse } from "next/server";
import { verifySession } from "@/app/lib/session";
import { uploadImageToCloudinary } from "@/app/lib/cloudinary";
import { getLocale } from "@/app/lib/i18n/locale";
import { getDictionary } from "@/app/lib/i18n/dictionaries";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const dict = getDictionary(await getLocale());

  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: dict.admin.unauthorized }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: dict.admin.noFileSent }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: dict.admin.unsupportedFormat },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: dict.admin.imageTooLarge },
      { status: 400 }
    );
  }

  try {
    const url = await uploadImageToCloudinary(file);
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json(
      { error: dict.admin.uploadError },
      { status: 500 }
    );
  }
}
