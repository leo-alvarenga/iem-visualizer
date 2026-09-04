import { useMemo, useState, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { PageState } from "@/components/PageState";
import { useCapabilities } from "@/hooks/useCapabilities";
import { groupByBrand, searchIems } from "@/lib/catalog";
import type { IemMeta } from "@/types";

export function LibraryPage() {
  const { t } = useTranslation();
  const { caps, error } = useCapabilities();
  const [query, setQuery] = useState("");

  const grouped = useMemo<Map<string, IemMeta[]>>(() => {
    if (!caps) return new Map();
    return groupByBrand(searchIems(caps.iems, query));
  }, [caps, query]);

  if (!caps) {
    return (
      <PageState>
        {error ? t("common.loadError", { error }) : t("common.loading")}
      </PageState>
    );
  }

  return (
    <div className="reveal flex flex-1 flex-col gap-6" style={{ "--i": 0 } as CSSProperties}>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">{t("library.title")}</h1>
          <p className="text-sm text-(--color-muted)">
            {t("library.count", { count: caps.iems.length })}
          </p>
        </div>

        <label className="flex items-center gap-2 rounded-full border border-[var(--color-rule)] bg-[var(--color-paper-2)] px-3 py-2">
          <Search className="size-4 text-(--color-muted)" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("library.search")}
            className="w-48 bg-transparent text-sm outline-none placeholder:text-(--color-neutral)"
          />
        </label>
      </header>

      <div className="flex flex-col gap-10">
        {[...grouped.entries()].map(([brand, iems]) => (
          <section key={brand} className="flex flex-col gap-3">
            <h2 className="font-outlier text-xs uppercase tracking-[0.12em] text-(--color-muted)">
              {brand}
            </h2>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {iems.map((iem) => (
                <li key={iem.id}>
                  <Link
                    to={`/iem/${iem.id}`}
                    className="surface block px-4 py-3 transition-transform duration-[var(--dur-short)] ease-[var(--ease-out)] hover:-translate-y-0.5"
                  >
                    <span className="block text-sm font-medium text-(--color-ink)">
                      {iem.name}
                    </span>
                    <span className="mt-1 block font-outlier text-xs text-(--color-neutral)">
                      {iem.source} · {iem.rig}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
