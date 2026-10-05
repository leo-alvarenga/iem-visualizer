import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "lucide-react";
import { toast } from "sonner";

import { DeviceSelector } from "@/components/DeviceSelector";
import { PageState } from "@/components/PageState";
import { Button } from "@/components/ui/button";
import { useFullscreen } from "@/hooks/useFullscreen";
import { useSquigCurves, useTargetCurve } from "@/hooks/useSquigCurves";

import { CompareChartPanel, CompareControls } from "./components";
import { useCompareChart, useCompareSelection, useSplitResize } from "./hooks";

export function ComparePage() {
  const { t } = useTranslation();
  const {
    error,
    zoomIn,
    entries,
    targets,
    loading,
    targetId,
    setZoomIn,
    selectIems,
    targetEntry,
    selectTarget,
    selectRegion,
    selectedIems,
    highlightRegion,
    selectedIemEntries,
    showTarget,
  } = useCompareSelection();

  const { splitWidth, startResize, onResize, stopResize } = useSplitResize();

  const chartRef = useRef<HTMLDivElement>(null);
  const { toggle, isFullscreen } = useFullscreen(chartRef);

  const { curve: targetCurve, failedId } = useTargetCurve(targetEntry);

  const visibleTargets = useMemo(
    () => (failedId ? targets.filter((t) => t.id !== failedId) : targets),
    [targets, failedId],
  );

  useEffect(() => {
    if (failedId && failedId === targetId) selectTarget(null);
  }, [failedId, targetId, visibleTargets]);

  const { curves, pending, errorIds } = useSquigCurves(selectedIemEntries);

  const { series, data, deviceOptions } = useCompareChart({
    curves,
    entries,
    selectedIemEntries,
    targetCurve: showTarget ? targetCurve : null,
    targetEntry: showTarget ? targetEntry : null,
  });

  if (!entries.length && loading) {
    return (
      <PageState>
        {error ? t("common.loadError", { error }) : t("common.loading")}
      </PageState>
    );
  }

  return (
    <>
      <div
        style={{ "--i": 0 } as CSSProperties}
        className="reveal flex flex-1 flex-col gap-6"
      >
        <header className="flex items-center gap-3 w-full">
          <hgroup className="flex flex-col gap-3 sm:[w-80%] md:w-[70%]">
            <span className="font-code text-sm tracking-[0.2em] text-(--color-accent)">
              ~/compare
            </span>

            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {t("compare.title")}
            </h1>

            <p className="text-sm text-(--color-muted)">
              {t("compare.subtitle")}
            </p>
          </hgroup>

          <Button
            size="sm"
            variant="default"
            className="ml-auto cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);

              toast(t("compare.copyUrlSuccess"));
            }}
          >
            <Link />

            {t("compare.copyUrl")}
          </Button>
        </header>

        <div className="flex h-full flex-1 flex-col-reverse gap-4 lg:flex-row">
          <aside
            className="w-full shrink-0 lg:w-(--split-w)"
            style={{ "--split-w": `${splitWidth}px` } as CSSProperties}
          >
            <DeviceSelector
              errorIds={errorIds}
              onChange={selectIems}
              options={deviceOptions}
              selected={selectedIems}
              label={t("compare.deviceLabel")}
              className="h-1/2 overflow-y-auto"
              getItem={(id) => deviceOptions.find((dev) => dev.id === id)}
            />

            <DeviceSelector
              multiple={false}
              minQueryLength={0}
              label={t("compare.targetLabel")}
              className="h-1/2 overflow-y-auto"
              selected={targetId ? [targetId] : []}
              getItem={(id) => targets.find((t) => t.id === id)}
              options={targets.map((t) => ({ id: t.id, name: t.name }))}

              onChange={(ids) => selectTarget(ids[0] || null)}
            />
          </aside>

          <div
            aria-hidden
            onPointerMove={onResize}
            onPointerUp={stopResize}
            onPointerDown={startResize}
            className="hidden cursor-col-resize bg-(--color-rule) transition-colors hover:bg-(--color-accent) lg:block lg:w-1.5"
          />

          <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 lg:h-[72vh]">
            <CompareControls
              zoomIn={zoomIn}
              onZoomInChange={setZoomIn}
              onRegionChange={selectRegion}
              highlightRegion={highlightRegion}
            />

            {error && (
              <p className="rounded-lg border border-destructive/41 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </p>
            )}

            <CompareChartPanel
              data={data}
              ref={chartRef}
              series={series}
              zoomIn={zoomIn}
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggle}
              pending={pending || loading}
              highlightRegion={highlightRegion}
              targetName={showTarget ? targetEntry?.name : undefined}
            />
          </div>
        </div>
      </div>
    </>
  );
}
