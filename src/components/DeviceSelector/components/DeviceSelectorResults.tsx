import { useTranslation } from "react-i18next";
import { Checkbox } from "@/components/ui/checkbox";
import { MAX_RESULTS, MIN_QUERY, type DeviceOption } from "../hooks";
import { hasError } from "@/lib/squig/measurements";
import { cn } from "@/lib/utils";

export type DeviceSelectorResultsProps = {
  total: number;
  ready: boolean;
  debounced: string;
  selected: string[];
  matches: DeviceOption[];
  onToggle: (id: string) => void;
  getItem: (id: string) => DeviceOption | undefined;
};

export function DeviceSelectorResults({
  ready,
  total,
  matches,
  getItem,
  selected,
  onToggle,
  debounced,
}: DeviceSelectorResultsProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      {!ready ? (
        <p className="px-2 py-1.5 font-code text-xs text-(--color-muted)">
          {t("deviceSelector.minChars", { count: MIN_QUERY })}

          {selected.map((opt) => {
            const item = getItem(opt);
            if (!item) return null;

            return (
              <label
                key={opt}
                className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
              >
                <Checkbox checked onCheckedChange={() => onToggle(opt)} />

                <span className="truncate">{item.name}</span>
              </label>
            );
          })}
        </p>
      ) : matches.length === 0 ? (
        <p className="px-2 py-1.5 font-code text-xs text-(--color-muted)">
          {t("deviceSelector.noResults", { query: debounced.trim() })}
        </p>
      ) : (
        <>
          {matches.map((opt) => {
            const error = hasError(opt.id);

            return (
              <label
                key={opt.id}
                className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
              >
                <Checkbox
                  disabled={error}
                  checked={selected.includes(opt.id)}
                  onCheckedChange={() => onToggle(opt.id)}
                />

                <span
                  className={cn("truncate", error ? "text-destructive" : "")}
                >
                  {opt.name}
                </span>
              </label>
            );
          })}

          {total > MAX_RESULTS && (
            <p className="px-2 py-1.5 font-code text-[10px] text-(--color-muted)">
              {t("deviceSelector.refine", { shown: MAX_RESULTS, total })}
            </p>
          )}
        </>
      )}
    </div>
  );
}
