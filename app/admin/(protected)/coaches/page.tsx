import Link from "next/link";
import { prisma } from "@/app/lib/db";
import { DeleteButton } from "@/app/components/DeleteButton";
import { deleteCoach } from "@/app/lib/actions/coaches";
import { getLocale } from "@/app/lib/i18n/locale";
import { getDictionary } from "@/app/lib/i18n/dictionaries";

export default async function AdminCoachesPage(
  props: PageProps<"/admin/coaches">
) {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const { q } = await props.searchParams;
  const query = typeof q === "string" ? q.trim() : "";

  const coaches = await prisma.coach.findMany({
    where: query
      ? { name: { contains: query, mode: "insensitive" } }
      : undefined,
    orderBy: { createdAt: "desc" },
    take: 15,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif-display text-2xl font-semibold">{dict.nav.coaches}</h1>
        <Link
          href="/admin/coaches/new"
          className="btn-gold px-4 py-2"
        >
          {dict.admin.addCoach}
        </Link>
      </div>

      <form className="mb-4">
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder={dict.admin.searchByName}
          className="input max-w-xs"
        />
      </form>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-navy-900/5 text-right">
            <tr>
              <th className="p-3">{dict.admin.name}</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {coaches.map((coach) => (
              <tr key={coach.id} className="border-t border-hairline">
                <td className="p-3">{coach.name}</td>
                <td className="p-3 flex gap-3 justify-end">
                  <Link
                    href={`/admin/coaches/${coach.id}/edit`}
                    className="text-royal-600 hover:underline"
                  >
                    {dict.admin.edit}
                  </Link>
                  <DeleteButton
                    action={deleteCoach.bind(null, coach.id)}
                    confirmMessage={dict.admin.confirmDelete}
                    label={dict.admin.delete}
                  />
                </td>
              </tr>
            ))}
            {coaches.length === 0 && (
              <tr>
                <td colSpan={2} className="p-6 text-center text-slate-500">
                  {dict.coaches.empty}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
