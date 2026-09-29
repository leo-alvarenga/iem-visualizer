import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { buildDisplayEntries, type DisplayEntry } from "@/lib/catalog";
import type { PhoneEntry } from "@/types";

export type UseDeviceSearchParams = {
  entries: PhoneEntry[];
};

export function useDeviceSearch(params: UseDeviceSearchParams) {
  const { entries } = params;

  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [, setSearchParams] = useSearchParams();

  const displayEntries = useMemo(() => buildDisplayEntries(entries), [entries]);

  const suggestions = useMemo(() => {
    if (!query?.trim()) return [];
    const q = query.trim().toLowerCase();

    const isAMatch = (e?: Partial<DisplayEntry>): boolean => {
      const values: unknown[] = [e?.name ?? "", e?.brand ?? ""];

      return values.some(
        (val) =>
          val &&
          typeof val === "string" &&
          val.trim().toLowerCase().includes(q),
      );
    };

    return displayEntries
      .reduce<DisplayEntry[]>((acc, e) => {
        try {
          if (isAMatch(e)) {
            acc.push(e);
          }

          return acc;
        } catch {
          return acc;
        }
      }, [])
      .slice(0, 8);
  }, [query, displayEntries]);

  const selectDevice = (id: string) => {
    setSearchParams({ device: id }, { replace: false });
    setQuery("");
    setShowSuggestions(false);
  };

  return {
    query,
    setQuery,
    showSuggestions,
    setShowSuggestions,
    suggestions,
    selectDevice,
  };
}
