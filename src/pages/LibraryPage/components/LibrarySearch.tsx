import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { DisplayEntry } from "@/lib/catalog";
import type { PhoneEntry } from "@/types";

import { useDeviceSearch } from "../hooks";

export type LibrarySearchProps = {
  entries: PhoneEntry[];
  loading: boolean;
};

export function LibrarySearch(props: LibrarySearchProps) {
  const { entries, loading } = props;
  const { t } = useTranslation();
  const {
    query,
    setQuery,
    showSuggestions,
    setShowSuggestions,
    suggestions,
    selectDevice,
  } = useDeviceSearch({ entries });

  const entryLabel = (e: DisplayEntry) =>
    e.showReviewer
      ? `${e.brand} ${e.name} | ${t("library.measuredBy", { reviewer: e.reviewerName })}`
      : `${e.brand} ${e.name}`;

  return (
    <>
      <div className="relative w-full max-w-xl">
        <div className="flex items-center gap-2 border border-(--color-rule) bg-(--color-paper-3) px-3 py-2">
          <Search className="size-4 shrink-0 text-(--color-muted)" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            placeholder={t("library.searchPlaceholder")}
            className="flex-1 bg-transparent font-code text-sm outline-none placeholder:text-(--color-muted)"
          />
          {loading && (
            <span
              className="size-1.5 shrink-0 animate-blink bg-(--color-accent)"
              aria-hidden
            />
          )}
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute top-full z-10 max-h-64 w-full overflow-y-auto border border-(--color-rule) bg-(--color-paper-3) shadow-lg">
            {suggestions.map((e) => (
              <li key={e.id}>
                <button
                  type="button"
                  onMouseDown={() => selectDevice(e.id)}
                  className="w-full cursor-pointer px-4 py-2 text-left font-code text-sm text-(--color-ink) hover:bg-(--color-bg2)"
                >
                  {entryLabel(e)}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {query.trim() && suggestions.length === 0 && !loading && (
        <p className="text-sm text-(--color-muted)">
          {t("library.noResults", { query })}
        </p>
      )}
    </>
  );
}
