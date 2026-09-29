import { Line } from "recharts";

import type { SeriesMeta } from "../Chart.types";

interface ChartSeriesLinesProps {
  series: SeriesMeta[];
  active: string | null;
  onEnter: (key: string) => void;
  onLeave: () => void;
  onToggle: (key: string) => void;
}

export function ChartSeriesLines({
  series,
  active,
  onEnter,
  onLeave,
  onToggle,
}: ChartSeriesLinesProps) {
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
          animationBegin={300}
          animationDuration={1000}
          animationEasing="ease-in-out"
          onMouseLeave={onLeave}
          onMouseEnter={() => onEnter(s.key)}
          strokeDasharray={s.dashed ? "12 8" : undefined}
          strokeOpacity={!active || active === s.key ? 1 : 0.5}
          onClick={() => onToggle(s.key)}
        />
      ))}
    </>
  );
}
