import Link from "next/link";
import { prisma } from "@/app/lib/db";
import { DeleteFoundationButton } from "@/app/components/DeleteFoundationButton";
import { deleteFoundation } from "@/app/lib/actions/foundations";
import { getLocale } from "@/app/lib/i18n/locale";
import { getDictionary } from "@/app/lib/i18n/dictionaries";

export default async function AdminFoundationsPage(
  props: PageProps<"/admin/foundations">
) {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const { q } = await props.searchParams;
  const query = typeof q === "string" ? q.trim() : "";

  const foundations = await prisma.accreditedFoundation.findMany({
    where: query
      ? { name: { contains: query, mode: "insensitive" } }
      : undefined,
    orderBy: { createdAt: "desc" },
    take: 15,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif-display text-2xl font-semibold">{dict.nav.foundations}</h1>
        <Link
          href="/admin/foundations/new"
          className="btn-gold px-4 py-2"
        >
          {dict.admin.addFoundation}
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
            {foundations.map((foundation) => (
              <tr key={foundation.id} className="border-t border-hairline">
                <td className="p-3">{foundation.name}</td>
                <td className="p-3">
                  <div className="flex gap-3 justify-end items-start">
                    <Link
                      href={`/admin/foundations/${foundation.id}/edit`}
                      className="text-royal-600 hover:underline"
                    >
                      {dict.admin.edit}
                    </Link>
                    <DeleteFoundationButton
                      action={deleteFoundation.bind(null, foundation.id)}
                      confirmMessage={dict.admin.confirmDelete}
                      label={dict.admin.delete}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {foundations.length === 0 && (
              <tr>
                <td colSpan={2} className="p-6 text-center text-slate-500">
                  {dict.foundations.empty}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
