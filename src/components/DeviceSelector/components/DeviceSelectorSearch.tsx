import { Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DeviceSelectorSearchProps {
  label: string;
  query: string;
  selectedCount: number;
  minQueryLength: number;
  onQueryChange: (value: string) => void;
}

export function DeviceSelectorSearch({
  label,
  query,
  selectedCount,
  onQueryChange,
  minQueryLength,
}: DeviceSelectorSearchProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <span className="font-code text-xs uppercase tracking-[0.2em] text-(--color-muted)">
          {label}
        </span>

        {selectedCount > 0 && (
          <span className="font-code text-[10px] text-(--color-accent)">
            {t("deviceSelector.selected", { count: selectedCount })}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 border border-(--color-rule) bg-(--color-bg1) px-3 py-2">
        <Search className="size-4 shrink-0 text-(--color-muted)" />

        <input
          type="text"
          value={query}
          aria-label={label}

          placeholder={
            minQueryLength > 0
              ? t("deviceSelector.placeholder", {
                  count: minQueryLength,
                })
              : t("deviceSelector.placeholderGeneric")
          }

          onChange={(e) => onQueryChange(e.target.value)}
          className="min-w-0 flex-1 bg-transparent font-code text-sm outline-none placeholder:text-(--color-muted)"
        />

        {query.length > 0 && (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            className="cursor-pointer hover:text-(--color-accent)"
          >
            <X />
          </button>
        )}
      </div>
    </>
  );
}
