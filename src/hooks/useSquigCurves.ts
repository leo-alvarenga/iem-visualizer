import { useEffect, useState } from "react";
import { fetchMeasurementCoalesced, fetchTargetPoints } from "@/lib/squig";
import type { PhoneEntry, TargetEntry, FrPoints } from "@/types";

type CurveResult = { points: FrPoints; channel: "AVG" | "L" | "R" };

export function useSquigCurves(entries: PhoneEntry[]) {
  const [curves, setCurves] = useState<Map<string, CurveResult>>(new Map());

  useEffect(() => {
    let cancelled = false;

    for (const entry of entries) {
      fetchMeasurementCoalesced(entry)
        .then((result) => {
          if (!cancelled)
            setCurves((prev) => new Map(prev).set(entry.id, result));
        })
        .catch(() => {});
    }

    return () => {
      cancelled = true;
    };
  }, [entries]);

  const pending = entries.some((e) => !curves.has(e.id));
  return { curves, pending };
}

export function useTargetCurve(target: TargetEntry | null) {
  const [curve, setCurve] = useState<FrPoints | null>(null);

  useEffect(() => {
    if (!target) {
      setCurve(null);
      return;
    }

    let cancelled = false;

    fetchTargetPoints(target)
      .then((pts) => {
        if (!cancelled) setCurve(pts);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [target?.id]);

  return { curve };
}
