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
import { useChartAxes, useChartTooltip } from "./hooks";

export function Chart({
  ref,
  data,
  series,
  xTitle,
  yTitle,
  inspect,
  targetName,
  zoomInHighlight,
  highlightRegions,
}: ChartProps) {
  const { t } = useTranslation();

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
  });

  if (series.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-(--color-muted)">
        {t("chart.empty")}
      </div>
    );
  }

  return (
    <ResponsiveContainer
      ref={ref}
      width="100%"
      height="100%"
      minHeight={300}
      className="select-none"
    >
      <LineChart data={data} cursor="crosshair">
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-rule)" />

        <XAxis {...horizontalAxis} />
        <YAxis {...verticalAxis} />

        {inspect && (
          <Tooltip
            filterNull={false}
            formatter={tooltipFormatter}
            offset={Math.min(window.innerWidth * 0.2, 80)}
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
                <span className="inline-flex flex-wrap gap-1 items-center pt-2 px-2 pb-1 w-full border-b border-b-(--series-target) bg-(--color-overlay0)/20">
                  <span className="text-(--color-accent) font-bold">{`${formatFreq(f)}Hz`}</span>

                  {range && (
                    <span className="text-(--color-muted) italic">{` - ${t(`ranges.${range.id}`)}`}</span>
                  )}
                </span>
              );
            }}

            contentStyle={{
              fontSize: 10,
              border: "none",
              borderRadius: 0,
              minWidth: "10vw",
              maxWidth: "30vw",
              textWrap: "wrap",
              overflow: "hidden",
              wordBreak: "break-word",
              backgroundColor: "#00000000",
            }}
          />
        )}

        <Legend position="bottom" offset={40} wrapperStyle={{ fontSize: 12 }} />

        <ChartRangeAreas highlightRegions={highlightRegions} />

        <ChartSeriesLines series={series} />
      </LineChart>
    </ResponsiveContainer>
  );
}
