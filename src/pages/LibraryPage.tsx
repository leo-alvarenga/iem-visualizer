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
    <div
      className="reveal flex flex-1 flex-col gap-6"
      style={{ "--i": 0 } as CSSProperties}
    >
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3">
          <span className="font-code text-sm tracking-[0.2em] text-(--color-accent)">
            ~/library
          </span>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t("library.title")}
          </h1>

          <p className="text-sm text-(--color-muted)">
            {t("library.count", { count: caps.iems.length })}
          </p>
        </div>

        <label className="flex w-full items-center gap-2 border border-(--color-rule) bg-(--color-paper-2) px-3 py-2 transition-colors hover:border-(--color-accent) focus-within:border-(--color-accent) sm:w-auto">
          <Search
            className="size-4 shrink-0 text-(--color-muted)"
            aria-hidden
          />

          <input
            value={query}
            placeholder={t("library.search")}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent font-code text-sm outline-none placeholder:text-(--color-neutral) sm:w-48"
          />
        </label>
      </header>

      <div className="flex flex-col gap-10">
        {[...grouped.entries()].map(([brand, iems]) => (
          <section key={brand} className="flex flex-col gap-3">
            <h2 className="font-code text-xs uppercase tracking-[0.12em] text-(--color-muted)">
              {brand}
            </h2>

            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {iems.map((iem) => (
                <li key={iem.id}>
                  <Link
                    to={`/iem/${iem.id}`}
                    className="block border border-(--color-rule) px-4 py-3 transition-colors duration-250 hover:border-(--color-accent)"
                  >
                    <span className="block text-sm font-medium text-(--color-ink)">
                      {iem.name}
                    </span>

                    <span className="mt-1 block font-code text-xs text-(--color-neutral)">
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
