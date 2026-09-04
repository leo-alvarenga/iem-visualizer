import { useEffect, useState } from "react";
import { fetchCurve } from "@/lib/api";
import type { FrData } from "@/types";

type Meta = { id: string; file: string };

// Effect re-fires whenever the `metas` array identity changes; memoize it.
export function useCurves(metas: Meta[]) {
  const [curves, setCurves] = useState<Map<string, FrData>>(new Map());

  useEffect(() => {
    let cancelled = false;

    for (const m of metas) {
      fetchCurve(m)
        .then((data) => {
          if (!cancelled) setCurves((prev) => new Map(prev).set(m.id, data));
        })
        .catch(() => {
          // Missing curves stay absent from the map; callers treat them as
          // "not loaded" rather than fatal errors.
        });
    }

    return () => {
      cancelled = true;
    };
  }, [metas]);

  const pending = metas.some((m) => !curves.has(m.id));
  return { curves, pending };
}
