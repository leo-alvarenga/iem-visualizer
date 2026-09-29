import { useRef, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";

import { DeviceSelector } from "@/components/DeviceSelector";
import { OnboardingModal } from "@/components/OnboardingModal";
import { PageState } from "@/components/PageState";
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
  } = useCompareSelection();

  const { splitWidth, startResize, onResize, stopResize } = useSplitResize();

  const chartRef = useRef<HTMLDivElement>(null);
  const { toggle, isFullscreen } = useFullscreen(chartRef);

  const { curve: targetCurve } = useTargetCurve(targetEntry);
  const { curves, pending } = useSquigCurves(selectedIemEntries);

  const { series, data, deviceOptions } = useCompareChart({
    curves,
    entries,
    targetCurve,
    targetEntry,
    selectedIemEntries,
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
      <OnboardingModal />
      <div
        style={{ "--i": 0 } as CSSProperties}
        className="reveal flex flex-1 flex-col gap-6"
      >
        <header className="flex flex-col gap-3">
          <span className="font-code text-sm tracking-[0.2em] text-(--color-accent)">
            ~/compare
          </span>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t("compare.title")}
          </h1>

          <p className="max-w-xl text-sm text-(--color-muted)">
            {t("compare.subtitle")}
          </p>
        </header>

        <div className="flex min-h-0 flex-1 flex-col-reverse gap-4 lg:flex-row">
          <aside
            className="w-full shrink-0 lg:w-(--split-w)"
            style={{ "--split-w": `${splitWidth}px` } as CSSProperties}
          >
            <DeviceSelector
              onChange={selectIems}
              options={deviceOptions}
              selected={selectedIems}
              label={t("compare.deviceLabel")}
              className="h-[46vh] lg:h-[72vh]"
              getItem={(id) => deviceOptions.find((dev) => dev.id === id)}
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
              targets={targets}
              targetId={targetId}
              onZoomInChange={setZoomIn}
              onTargetChange={selectTarget}
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
              pending={pending}
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggle}
              targetName={targetEntry?.name}
              highlightRegion={highlightRegion}
            />
          </div>
        </div>
      </div>
    </>
  );
}
