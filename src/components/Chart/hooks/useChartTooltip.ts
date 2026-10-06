import { createElement } from "react";
import type { TooltipPayload, TooltipPayloadEntry } from "recharts";
import type { NameType } from "recharts/types/component/DefaultTooltipContent";

import { ChartTooltipContent } from "../components";
import type { ChartRow, SeriesMeta } from "../Chart.types";
import { getTooltipValue } from "../Chart.utils";

interface UseChartTooltipParams {
  data: ChartRow[];
  series: SeriesMeta[];
  targetName?: string;
  activeSeries?: string;
}

export function useChartTooltip({
  data,
  series,
  targetName,
  activeSeries,
}: UseChartTooltipParams) {
  return (
    value: unknown,
    name?: NameType,
    item?: TooltipPayloadEntry,
    _?: unknown,
    payload?: TooltipPayload,
  ) => {
    const [actualValue, f] = getTooltipValue(data, series, value, name, item);
    if (!actualValue) return "N/A";

    const originalTargetValue = targetName
      ? Number(payload?.find((p) => p.name === targetName)?.value)
      : undefined;

    const [targetValue] = getTooltipValue(
      data,
      series,
      originalTargetValue,
      targetName,
      item,
    );

    const key = series.find((s) => s.label === name)?.key;
    const isActiveSeries = activeSeries === key;

    const deviation = targetValue ? actualValue - targetValue || null : null;

    const percent =
      targetValue && deviation
        ? ((deviation / targetValue) * 100).toFixed(2)
        : null;

    return [
      createElement(ChartTooltipContent, {
        percent,
        deviation,
        targetName,
        frequency: f,
        isActiveSeries,
        value: actualValue,
        stroke: item?.stroke,
        name: name as NameType,
        currentFrequency: item?.payload?.f,
      }),
      null,
    ];
  };
}
