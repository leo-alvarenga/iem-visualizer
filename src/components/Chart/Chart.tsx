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
  xTitle,
  yTitle,
  targetName,
  zoomInHighlight,
  highlightRegions,
}: ChartProps) {
  const { t } = useTranslation();
  const { active, enter, leave, toggle } = useActiveSeries();

  const { horizontalAxis, verticalAxis } = useChartAxes({
    xTitle,
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
    <ResponsiveContainer ref={ref} width="100%" height="100%" minHeight={300}>
      <LineChart data={data} cursor="crosshair">
        <CartesianGrid
          stroke="var(--color-rule)"
          strokeDasharray="3 3"
          orientation="vertical"
        />

        <XAxis {...horizontalAxis} />
        <YAxis {...verticalAxis} />

        <Tooltip
          offset={80}
          filterNull={false}
          formatter={tooltipFormatter}
          cursor={{ stroke: "var(--color-muted)", strokeDasharray: "3 3" }}

          labelStyle={{
            fontSize: 10,
            marginBottom: 4,
            color: "var(--color-muted)",
          }}

          labelFormatter={(label) => {
            const f = Number(label);
            const range = getRangeFromValue(f);

            return (
              <span className="inline-flex flex-wrap gap-1 items-center pb-1 w-full border-b border-b-(--series-target)">
                <span className="text-(--color-accent) font-bold">{`${formatFreq(f)}Hz`}</span>

                {range && (
                  <span className="text-(--color-muted) italic">{` - ${t(`ranges.${range.id}`)}`}</span>
                )}
              </span>
            );
          }}

          contentStyle={{
            fontSize: 10,
            borderRadius: 0,
            minWidth: "10vw",
            maxWidth: "30vw",
            textWrap: "wrap",
            overflow: "hidden",
            wordBreak: "break-word",
            backgroundColor: "var(--color-bg2)",
            border: "1px solid var(--series-target)",
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
