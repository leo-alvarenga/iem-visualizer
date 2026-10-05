import { useEffect, useRef } from "react";
import { useQuery, useQueries } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchMeasurementCoalesced, fetchTargetPoints } from "@/lib/squig";
import type { PhoneEntry, TargetEntry, FrPoints } from "@/types";

export type CurveResult = { points: FrPoints; channel: "AVG" | "L" | "R" };

export function useSquigCurves(entries: PhoneEntry[]) {
  const results = useQueries({
    queries: entries.map((entry) => ({
      retry: 1,
      staleTime: Infinity,
      queryKey: ["measurement", entry.id],
      meta: { deviceName: entry.name },
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
  const hasWarned = useRef(new Set<string>());

  const { data: curve = null, isError } = useQuery({
    retry: 1,
    enabled: !!target,
    staleTime: Infinity,
    queryKey: ["target-curve", target?.id],
    queryFn: ({ signal }) => fetchTargetPoints(target!, signal),
  });

  useEffect(() => {
    if (isError && target && !hasWarned.current.has(target.id)) {
      hasWarned.current.add(target.id);
      toast(`Couldn't load target curve "${target.name}"`);
      console.warn(`Couldn't load target curve "${target.name}"`);
    }
  }, [isError, target]);

  return { curve, failedId: isError && target ? target.id : null };
}
