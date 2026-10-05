import { useEffect, useMemo, useState } from "react";

import type { ChartRow, SeriesMeta } from "@/components/Chart";
import { useSquigCurves, useTargetCurve } from "@/hooks/useSquigCurves";
import { mergeSeries } from "@/lib/normalize";
import { IEM_COLORS, TARGET_COLOR } from "@/lib/palette";
import type { PhoneEntry, TargetEntry } from "@/types";

export type UseLibraryChartParams = {
  entries: PhoneEntry[];
  targets: TargetEntry[];
  deviceId: string | null;
};

export function useLibraryChart(params: UseLibraryChartParams) {
  const { entries, targets, deviceId } = params;

  const [selectedTargetId, setSelectedTargetId] = useState("");
  const [showTarget, setShowTarget] = useState(true);

  useEffect(() => {
    if (targets.length && !selectedTargetId) setSelectedTargetId(targets[0].id);
  }, [targets, selectedTargetId]);

  const selectedEntry = useMemo(
    () => entries.find((e) => e.id === deviceId) ?? null,
    [entries, deviceId],
  );

  const selectedTarget = useMemo(
    () => targets.find((tg) => tg.id === selectedTargetId) ?? targets[0] ?? null,
    [targets, selectedTargetId],
  );

  const { curves, pending: iemPending, errorIds } = useSquigCurves(
    selectedEntry ? [selectedEntry] : [],
  );

  const iemResult = selectedEntry ? curves.get(selectedEntry.id) : undefined;

  const { curve: targetCurve, failedId } = useTargetCurve(selectedTarget);

  const visibleTargets = useMemo(
    () => (failedId ? targets.filter((t) => t.id !== failedId) : targets),
    [targets, failedId],
  );

  useEffect(() => {
    if (failedId && failedId === selectedTargetId) {
      const next = visibleTargets[0];
      setSelectedTargetId(next?.id ?? "");
    }
  }, [failedId, selectedTargetId, visibleTargets]);

  const { series, data } = useMemo(() => {
    if (!selectedEntry) {
      return { series: [] as SeriesMeta[], data: [] as ChartRow[] };
    }
    const raw: { meta: SeriesMeta; points: [number, number][] }[] = [];
    const series: SeriesMeta[] = [];

    if (iemResult) {
      const m = {
        key: "iem",
        label: `${selectedEntry.brand} ${selectedEntry.name}`,
        color: IEM_COLORS[0],
      };
      series.push(m);
      raw.push({ meta: m, points: iemResult.points });
    }

    if (showTarget && targetCurve && selectedTarget) {
      const m = {
        key: "target",
        dashed: true,
        label: selectedTarget.name,
        color: TARGET_COLOR,
      };
      series.push(m);
      raw.push({ meta: m, points: targetCurve });
    }

    return { series, data: mergeSeries(raw) };
  }, [selectedEntry, iemResult, targetCurve, selectedTarget, showTarget]);

  return {
    selectedEntry,
    selectedTarget,
    setSelectedTargetId,
    showTarget,
    setShowTarget,
    iemResult,
    iemPending,
    errorIds,
    series,
    data,
    targets: visibleTargets,
  };
}
