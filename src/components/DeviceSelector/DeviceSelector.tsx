import { cn } from "@/lib/utils";
import {
  DeviceSelectorResults,
  DeviceSelectorSearch,
  type DeviceSelectorResultsProps,
} from "./components";
import { useDeviceSearch, type DeviceOption } from "./hooks";

export type { DeviceOption };

interface DeviceSelectorProps {
  label: string;
  selected: string[];
  className?: string;
  options: DeviceOption[];
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
}: DeviceSelectorProps) {
  const { query, setQuery, debounced, ready, matches, total } = useDeviceSearch(
    { options },
  );

  const toggle = (id: string) => {
    onChange(
      selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id],
    );
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
        selectedCount={selected.length}
      />

      <DeviceSelectorResults
        ready={ready}
        total={total}
        getItem={getItem}
        matches={matches}
        onToggle={toggle}
        selected={selected}
        debounced={debounced}
      />
    </div>
  );
}
