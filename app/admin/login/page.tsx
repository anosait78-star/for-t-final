import Image from "next/image";
import { getLocale } from "@/app/lib/i18n/locale";
import { getDictionary } from "@/app/lib/i18n/dictionaries";
import { LoginForm } from "@/app/components/LoginForm";

export default async function AdminLoginPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto max-w-sm px-4 py-24">
      <div className="card p-8">
        <Image
          src="/logo.png"
          alt="FOR T"
          width={56}
          height={56}
          className="mx-auto mb-4 h-14 w-14 rounded-full border border-gold-400 object-contain p-1"
        />
        <h1 className="font-serif-display mb-6 text-center text-2xl font-semibold">
          {dict.admin.login}
        </h1>
        <LoginForm dict={dict} />
      </div>
    </div>
  );
}
