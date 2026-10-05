import { useTranslation } from "react-i18next";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MAX_RESULTS, MIN_QUERY, type DeviceOption } from "../hooks";

export type DeviceSelectorResultsProps = {
  total: number;
  ready: boolean;
  debounced: string;
  selected: string[];
  matches: DeviceOption[];
  errorIds?: Set<string>;
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
  errorIds,
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
            const isError = errorIds?.has(opt) ?? false;

            if (isError) {
              return (
                <Tooltip key={opt}>
                  <TooltipTrigger asChild>
                    <label className="flex cursor-not-allowed items-center gap-2.5 rounded-md px-2 py-1.5 text-sm opacity-60">
                      <Checkbox disabled checked />
                      <span className="truncate text-destructive">{item.name}</span>
                    </label>
                  </TooltipTrigger>
                  <TooltipContent>Failed to load measurement data</TooltipContent>
                </Tooltip>
              );
            }

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
            const error = errorIds?.has(opt.id) ?? false;

            if (error) {
              return (
                <Tooltip key={opt.id}>
                  <TooltipTrigger asChild>
                    <label className="flex cursor-not-allowed items-center gap-2.5 rounded-md px-2 py-1.5 text-sm opacity-60">
                      <Checkbox disabled checked={selected.includes(opt.id)} />
                      <span className="truncate text-destructive">
                        {opt.name}
                      </span>
                    </label>
                  </TooltipTrigger>
                  <TooltipContent>
                    Failed to load measurement data
                  </TooltipContent>
                </Tooltip>
              );
            }

            return (
              <label
                key={opt.id}
                className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
              >
                <Checkbox
                  checked={selected.includes(opt.id)}

                  onClick={() => onToggle(opt.id)}
                />
                <span className="truncate">{opt.name}</span>
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
