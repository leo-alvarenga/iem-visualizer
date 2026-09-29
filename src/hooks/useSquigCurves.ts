import { useQuery, useQueries } from "@tanstack/react-query";
import { fetchMeasurementCoalesced, fetchTargetPoints } from "@/lib/squig";
import type { PhoneEntry, TargetEntry, FrPoints } from "@/types";

export type CurveResult = { points: FrPoints; channel: "AVG" | "L" | "R" };

export function useSquigCurves(entries: PhoneEntry[]) {
  const results = useQueries({
    queries: entries.map((entry) => ({
      retry: 1,
      staleTime: Infinity,
      queryKey: ["measurement", entry.id],
      queryFn: ({ signal }) => fetchMeasurementCoalesced(entry, signal),
    })),
  });

  const curves = new Map<string, CurveResult>();
  const errorIds = new Set<string>();

  entries.forEach((entry, i) => {
    const q = results[i];

    if (q.data) curves.set(entry.id, q.data);
    if (q.isError) errorIds.add(entry.id);
  });

  return { curves, pending: results.some((q) => q.isPending), errorIds };
}

export function useTargetCurve(target: TargetEntry | null) {
  const { data: curve = null } = useQuery({
    retry: 1,
    enabled: !!target,
    staleTime: Infinity,
    queryKey: ["target-curve", target?.id],
    queryFn: ({ signal }) => fetchTargetPoints(target!, signal),
  });

  return { curve };
}
