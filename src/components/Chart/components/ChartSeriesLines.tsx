import { Line } from "recharts";

import type { SeriesMeta } from "../Chart.types";

interface ChartSeriesLinesProps {
  series: SeriesMeta[];
}

export function ChartSeriesLines({ series }: ChartSeriesLinesProps) {
  return (
    <>
      {series.map((s) => (
        <Line
          dot={false}
          key={s.key}
          connectNulls
          name={s.label}
          type="natural"
          dataKey={s.key}
          strokeWidth={2}
          stroke={s.color}
          cursor="pointer"
          activeDot={false}
          strokeOpacity={1}
          animationBegin={300}
          animationDuration={1000}
          animationEasing="ease-in-out"
          strokeDasharray={s.dashed ? "12 8" : undefined}
        />
      ))}
    </>
  );
}
