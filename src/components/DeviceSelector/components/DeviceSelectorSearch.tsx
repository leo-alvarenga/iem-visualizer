import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DeviceSelectorSearchProps {
  label: string;
  query: string;
  selectedCount: number;
  onQueryChange: (value: string) => void;
}

export function DeviceSelectorSearch({
  label,
  query,
  selectedCount,
  onQueryChange,
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
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={t("deviceSelector.placeholder")}
          aria-label={label}
          className="min-w-0 flex-1 bg-transparent font-code text-sm outline-none placeholder:text-(--color-muted)"
        />
      </div>
    </>
  );
}
