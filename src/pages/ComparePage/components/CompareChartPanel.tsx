import type { Ref } from "react";
import { useTranslation } from "react-i18next";
import { Maximize, Minimize } from "lucide-react";

import { Chart, type ChartRow, type SeriesMeta } from "@/components/Chart";

type CompareChartPanelProps = {
  zoomIn: boolean;
  data: ChartRow[];
  pending: boolean;
  inspect?: boolean;
  targetName?: string;
  series: SeriesMeta[];
  isFullscreen: boolean;
  highlightRegion: string;
  ref?: Ref<HTMLDivElement>;
  onToggleFullscreen: () => void;
};

export function CompareChartPanel({
  ref,
  data,
  series,
  zoomIn,
  inspect,
  pending,
  targetName,
  isFullscreen,
  highlightRegion,
  onToggleFullscreen,
}: CompareChartPanelProps) {
  const { t } = useTranslation();

  return (
    <main
      ref={ref}
      className="flex min-h-105 min-w-0 flex-1 flex-col overflow-hidden border border-(--color-rule) bg-(--color-paper-3)"
    >
      <div className="flex items-center gap-2 border-b border-(--color-rule) px-4 py-2 font-code text-xs text-(--color-muted)">
        <span className="text-(--color-accent)">$</span>
        <span>graph</span>

        <span className="ml-auto flex items-center gap-2">
          {pending && (
            <>
              <span
                className="size-1.5 animate-blink bg-(--color-accent)"
                aria-hidden
              />

              <span>{t("common.loading")}</span>
            </>
          )}

          <button
            onClick={onToggleFullscreen}
            className="cursor-pointer bg-(--color-bg1) p-2 transition-colors duration-300 hover:bg-(--color-bg2)"
          >
            {isFullscreen ? <Minimize /> : <Maximize />}
          </button>
        </span>
      </div>

      <div className="relative min-h-0 flex-1 p-4">
        <Chart
          data={data}
          series={series}
          inspect={inspect}
          targetName={targetName}
          zoomInHighlight={zoomIn}
          xTitle={t("compare.xRaw")}
          yTitle={t("compare.yRaw")}
          highlightRegions={highlightRegion}
        />
      </div>
    </main>
  );
}
