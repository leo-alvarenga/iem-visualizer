import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MAX_RESULTS, type DeviceOption } from "../hooks";

export type DeviceSelectorResultsProps = {
  total: number;
  ready: boolean;
  debounced: string;
  selected: string[];
  matches: DeviceOption[];
  errorIds?: Set<string>;
  minQueryLength: number;
  onToggle: (id: string) => void;
  hiddenIds?: Set<string>;
  onToggleHidden?: (id: string) => void;
  getItem: (id: string) => DeviceOption | undefined;
};

export function DeviceSelectorResults({
  ready,
  total,
  matches,
  getItem,
  errorIds,
  selected,
  onToggle,
  hiddenIds,
  onToggleHidden,
  debounced,
  minQueryLength,
}: DeviceSelectorResultsProps) {
  const { t } = useTranslation();

  const renderHideToggle = (id: string) => {
    if (!onToggleHidden) return null;

    const hidden = hiddenIds?.has(id) ?? false;

    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleHidden(id);
        }}
        aria-label={hidden ? "Show" : "Hide"}
        className="ml-auto shrink-0 cursor-pointer text-(--color-muted) hover:text-(--color-accent)"
      >
        {hidden ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    );
  };

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      {!ready ? (
        <p className="px-2 py-1.5 font-code text-xs text-(--color-muted)">
          {t("deviceSelector.minChars", { count: minQueryLength })}

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
                      <span className="truncate text-destructive">
                        {item.name}
                      </span>
                    </label>
                  </TooltipTrigger>

                  <TooltipContent>
                    Failed to load measurement data
                  </TooltipContent>
                </Tooltip>
              );
            }
            const hidden = hiddenIds?.has(opt) ?? false;

            return (
              <label
                key={opt}
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground",
                  hidden && "opacity-50",
                )}
                onClick={() => onToggle(opt)}
              >
                <Checkbox checked onCheckedChange={() => onToggle(opt)} />
                <span className="truncate">{item.name}</span>
                {renderHideToggle(opt)}
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

            const isSelected = selected.includes(opt.id);
            const hidden = hiddenIds?.has(opt.id) ?? false;

            return (
              <label
                key={opt.id}
                onClick={() => onToggle(opt.id)}
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground",
                  isSelected && hidden && "opacity-50",
                )}
              >
                <Checkbox
                  checked={isSelected}
                  onClick={(e) => e.stopPropagation()}
                />
                <span className="truncate">{opt.name}</span>
                {isSelected && renderHideToggle(opt.id)}
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
