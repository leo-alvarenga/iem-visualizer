import { useMemo } from "react";

import type { SeriesMeta } from "@/components/Chart";
import type { useSquigCurves } from "@/hooks/useSquigCurves";
import { buildDisplayEntries } from "@/lib/catalog";
import { mergeSeries } from "@/lib/normalize";
import { IEM_COLORS, TARGET_COLOR } from "@/lib/palette";
import type { FrPoints, PhoneEntry, TargetEntry } from "@/types";

type Curves = ReturnType<typeof useSquigCurves>["curves"];

export type UseCompareChartParams = {
  curves: Curves;
  entries: PhoneEntry[];
  targetCurve: FrPoints | null;
  targetEntry: TargetEntry | null;
  selectedIemEntries: PhoneEntry[];
};

export function useCompareChart({
  curves,
  entries,
  targetEntry,
  targetCurve,
  selectedIemEntries,
}: UseCompareChartParams) {
  const { deviceOptions, nameById } = useMemo(() => {
    const opts = buildDisplayEntries(entries).map((e) => ({
      id: e.id,
      name: e.showReviewer
        ? `${e.brand} ${e.name} — ${e.reviewerName}`
        : `${e.brand} ${e.name}`,
    }));

    return {
      deviceOptions: opts,
      nameById: new Map(opts.map((o) => [o.id, o.name])),
    };
  }, [entries]);

  const { series, data } = useMemo(() => {
    const raw: { meta: SeriesMeta; points: [number, number][] }[] = [];
    const series: SeriesMeta[] = [];

    if (targetEntry && targetCurve) {
      const m = {
        dashed: true,
        color: TARGET_COLOR,
        label: targetEntry.name,
        key: `target:${targetEntry.id}`,
      };

      series.push(m);
      raw.push({ meta: m, points: targetCurve });
    }

    selectedIemEntries.forEach((entry, idx) => {
      const result = curves.get(entry.id);
      if (!result) return;

      const m = {
        key: `iem:${entry.id}`,
        label: nameById.get(entry.id) ?? entry.name,
        color: IEM_COLORS[idx % IEM_COLORS.length],
      };

      series.push(m);
      raw.push({ meta: m, points: result.points });
    });

    return { series, data: mergeSeries(raw) };
  }, [selectedIemEntries, targetEntry, targetCurve, curves, nameById]);

  return { series, data, deviceOptions };
}
