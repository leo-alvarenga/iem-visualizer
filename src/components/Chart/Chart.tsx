import { useTranslation } from "react-i18next";
import {
  CartesianGrid,
  Legend,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartRangeAreas, ChartSeriesLines } from "./components";
import type { ChartProps } from "./Chart.types";
import { formatFreq, getRangeFromValue } from "./Chart.utils";
import { useActiveSeries, useChartAxes, useChartTooltip } from "./hooks";

export function Chart({
  ref,
  data,
  series,
  yTitle,
  targetName,
  zoomInHighlight,
  highlightRegions,
}: ChartProps) {
  const { t } = useTranslation();
  const { active, enter, leave, toggle } = useActiveSeries();
  const { horizontalAxis, verticalAxis } = useChartAxes({
    yTitle,
    zoomInHighlight,
    highlightRegions,
  });
  const tooltipFormatter = useChartTooltip({
    data,
    series,
    targetName,
    activeSeries: active ?? undefined,
  });

  if (series.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-(--color-muted)">
        {t("chart.empty")}
      </div>
    );
  }

  return (
    <ResponsiveContainer ref={ref} width="100%" height="100%">
      <LineChart data={data} cursor="crosshair">
        <CartesianGrid
          stroke="var(--color-rule)"
          strokeDasharray="3 3"
          orientation="vertical"
        />

        <XAxis {...horizontalAxis} />
        <YAxis {...verticalAxis} />

        <Tooltip
          filterNull={false}
          formatter={tooltipFormatter}
          cursor={{ stroke: "var(--color-muted)", strokeDasharray: "3 3" }}
          labelStyle={{
            color: "var(--color-muted)",
            marginBottom: 4,
            fontSize: 14,
          }}
          labelFormatter={(label) => {
            const f = Number(label);
            const range = getRangeFromValue(f);

            return (
              <span className="inline-flex gap-1 items-center pb-1 w-full border-b border-b-(--series-target)">
                <span className="text-(--color-accent) font-bold">{`${formatFreq(f)}Hz`}</span>

                {range && (
                  <span className="text-(--color-muted) italic">{` - ${t(`ranges.${range.id}`)}`}</span>
                )}
              </span>
            );
          }}
          contentStyle={{
            fontSize: 12,
            borderRadius: 0,
            border: "1px solid var(--series-target)",
            backgroundColor: "var(--color-paper-2)",
          }}
        />

        <Legend position="bottom" offset={40} wrapperStyle={{ fontSize: 12 }} />

        <ChartRangeAreas highlightRegions={highlightRegions} />

        <ChartSeriesLines
          series={series}
          active={active}
          onEnter={enter}
          onLeave={leave}
          onToggle={toggle}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
