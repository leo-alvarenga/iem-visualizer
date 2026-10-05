import { useEffect, useMemo, useState } from "react";

export interface DeviceOption {
  id: string;
  name: string;
}

export const MIN_QUERY = 2;
export const MAX_RESULTS = 50;

const DEBOUNCE_MS = 500;

export interface UseDeviceSearchParams {
  minQueryLength: number;
  options: DeviceOption[];
}

export function useDeviceSearch({
  minQueryLength,
  options,
}: UseDeviceSearchParams) {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const id = setTimeout(() => setDebounced(query), DEBOUNCE_MS);

    return () => clearTimeout(id);
  }, [query]);

  const q = debounced.trim().toLowerCase();
  const ready = q.length >= minQueryLength;

  // Filter only once the debounced query is long enough, and cap rendered rows so
  // a broad query can never mount thousands of checkboxes and stall the page
  const { matches, total } = useMemo(() => {
    if (!ready) return { matches: [] as DeviceOption[], total: 0 };
    const hits = options.filter((o) => o.name.toLowerCase().includes(q));

    return { matches: hits.slice(0, MAX_RESULTS), total: hits.length };
  }, [options, q, ready]);

  return { query, setQuery, debounced, ready, matches, total };
}
