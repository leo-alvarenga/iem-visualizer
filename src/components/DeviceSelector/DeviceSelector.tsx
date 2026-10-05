import { cn } from "@/lib/utils";
import {
  DeviceSelectorResults,
  DeviceSelectorSearch,
  type DeviceSelectorResultsProps,
} from "./components";
import { MIN_QUERY, useDeviceSearch, type DeviceOption } from "./hooks";

export type { DeviceOption };

interface DeviceSelectorProps {
  label: string;
  selected: string[];
  className?: string;
  multiple?: boolean;
  errorIds?: Set<string>;
  options: DeviceOption[];
  minQueryLength?: number;
  onChange: (ids: string[]) => void;
  getItem: DeviceSelectorResultsProps["getItem"];
}

export function DeviceSelector({
  label,
  options,
  getItem,
  selected,
  onChange,
  className,
  errorIds,
  multiple = true,
  minQueryLength = MIN_QUERY,
}: DeviceSelectorProps) {
  const { query, setQuery, debounced, ready, matches, total } = useDeviceSearch(
    { minQueryLength, options },
  );

  const toggle = (id: string) => {
    if (multiple) {
      onChange(
        selected.includes(id)
          ? selected.filter((s) => s !== id)
          : [...selected, id],
      );
    } else {
      onChange(selected.includes(id) ? [] : [id]);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border border-(--color-rule) bg-(--color-paper-3) p-3",
        className,
      )}
    >
      <DeviceSelectorSearch
        label={label}
        query={query}
        onQueryChange={setQuery}
        minQueryLength={minQueryLength}
        selectedCount={selected.length}
      />

      <DeviceSelectorResults
        ready={ready}
        total={total}
        getItem={getItem}
        matches={matches}
        onToggle={toggle}
        selected={selected}
        errorIds={errorIds}
        debounced={debounced}
        minQueryLength={minQueryLength}
      />
    </div>
  );
}
