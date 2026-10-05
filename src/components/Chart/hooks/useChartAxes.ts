import type { XAxisProps, YAxisProps } from "recharts";

import { DBS_TICKS, FREQ_MAX, FREQ_MIN, FREQ_TICKS } from "@/lib/constants";
import type { RangeCategory } from "@/types";

import { formatFreq, getHighlightRange } from "../Chart.utils";

const tickStyle = { fontSize: 11 };

interface UseChartAxesParams {
  xTitle: string;
  yTitle: string;
  zoomInHighlight?: boolean;
  highlightRegions?: string | RangeCategory;
}

export function useChartAxes({
  xTitle,
  yTitle,
  zoomInHighlight,
  highlightRegions,
}: UseChartAxesParams) {
  const horizontalAxis: XAxisProps = {
    axisLine: true,
    tickLine: true,
    dataKey: "f",
    scale: "log",
    type: "number",
    tickMargin: 8,
    tick: tickStyle,
    allowDataOverflow: true,
    ticks: FREQ_TICKS,
    tickFormatter: formatFreq,

    domain: zoomInHighlight
      ? (getHighlightRange(highlightRegions) ?? [FREQ_MIN, FREQ_MAX])
      : [FREQ_MIN, FREQ_MAX],

    label: {
      offset: 12,
      value: xTitle,
      position: "bottom",
      style: { fontSize: 12 },
    },
  };

  const verticalAxis: YAxisProps = {
    width: 64,
    axisLine: true,
    tickLine: true,
    tick: tickStyle,
    ticks: DBS_TICKS,

    tickFormatter: (v: number) => v.toFixed(0),

    label: {
      angle: -90,
      offset: 12,
      value: yTitle,
      position: "insideLeft",
      style: { fontSize: 12 },
    },
  };

  return { horizontalAxis, verticalAxis };
}
