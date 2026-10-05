import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useSquigCatalog } from "@/hooks/useSquigCatalog";

function readIds(param: string | null, fallback: string[]): string[] {
  if (param === null) return fallback;

  const ids = param.split(",").filter(Boolean);

  return ids.length ? ids : fallback;
}

export function useCompareSelection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { entries, targets, loading, error } = useSquigCatalog();
  const [zoomIn, setZoomIn] = useState(false);

  const selectedIems = useMemo(
    () => readIds(searchParams.get("device"), []),
    [searchParams, entries],
  );

  const targetId = useMemo(
    () => searchParams.get("target") ?? null,
    [searchParams, targets],
  );

  const targetEntry = useMemo(
    () => targets.find((t) => t.id === targetId) ?? null,
    [targets, targetId],
  );

  const showTarget = searchParams.get("showTarget") !== "0";
  const highlightRegion = searchParams.get("region") ?? "none";

  const selectedIemEntries = useMemo(
    () => entries.filter((e) => selectedIems.includes(e.id)),
    [entries, selectedIems],
  );

  const updateParams = (
    iems: string[],
    target: string | null,
    region?: string,
  ) => {
    const next = new URLSearchParams();

    if (iems.length) {
      next.set("device", iems.join(","));
    } else {
      next.delete("device");
    }

    if (target) next.set("target", target);
    else next.delete("target");

    if (region) next.set("region", region);
    else next.delete("region");

    setSearchParams(next, { replace: true });
  };

  const selectIems = (ids: string[]) => updateParams(ids, targetId, undefined);

  const selectTarget = (id: string | null) =>
    updateParams(selectedIems, id, undefined);

  const selectRegion = (id: string) => {
    updateParams(selectedIems, targetId, id === "none" ? undefined : id);

    if (id === "none") setZoomIn(false);
  };

  return {
    error,
    zoomIn,
    entries,
    targets,
    loading,
    targetId,
    setZoomIn,
    selectIems,
    showTarget,
    targetEntry,
    selectTarget,
    selectRegion,
    selectedIems,
    highlightRegion,
    selectedIemEntries,
  };
}
