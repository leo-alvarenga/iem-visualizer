import { useTranslation } from "react-i18next";
import { FREQ_MAX, FREQ_MIN, FREQ_RANGES, FREQ_TICKS } from "@/lib/constants";
import { IEM_COLORS } from "@/lib/palette";
import type { NamedRange, RangeCategory } from "@/types";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface SeriesMeta {
  key: string;
  label: string;
  color: string;
  dashed?: boolean;
}

// One row per frequency; series keys plus the shared `f` column.
export type ChartRow = { f: number } & Record<string, number>;

interface ChartProps {
  yTitle: string;
  data: ChartRow[];
  series: SeriesMeta[];
  zoomInHighlight?: boolean;
  highlightRegions?: string | RangeCategory;
}

function formatFreq(f: number): string {
  return f >= 1000 ? `${f / 1000}k` : String(f);
}

function getHighlightRange(
  highlightRegions?: string | RangeCategory,
): [number, number] | null {
  if (!highlightRegions || highlightRegions.length === 0) return null;

  const ranges = FREQ_RANGES.filter(
    (range) => highlightRegions === range.id || highlightRegions === range.category,
  );

  if (ranges.length === 0) return null;

  return ranges.reduce(
    (acc, range) => {
      if (acc[0] > range.x1) acc[0] = range.x1;
      if (acc[1] < range.x2) acc[1] = range.x2;

      return acc;
    },
    [ranges[0].x1, ranges[0].x2],
  );
}

function getRangeFromValue(value: number): NamedRange | undefined {
  return FREQ_RANGES.find(
    (range) => value >= range.x1 && value <= range.x2,
  );
}


const tickStyle = { fill: "var(--color-muted)", fontSize: 11 };

export function Chart({
  data,
  series,
  yTitle,
  highlightRegions,
  zoomInHighlight,
}: ChartProps) {
  const { t } = useTranslation();
  if (series.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-(--color-muted)">
        {t("chart.empty")}
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
      >
        <CartesianGrid stroke="var(--color-rule)" strokeDasharray="3 3" />

        <XAxis
          dataKey="f"
          scale="log"
          type="number"
          tickMargin={8}
          tick={tickStyle}
          tickLine={false}
          allowDataOverflow
          ticks={FREQ_TICKS}
          tickFormatter={formatFreq}
          axisLine={{ stroke: "var(--color-rule)" }}
          domain={
            zoomInHighlight
              ? (getHighlightRange(highlightRegions) ?? [FREQ_MIN, FREQ_MAX])
              : [FREQ_MIN, FREQ_MAX]
          }
        />

        <YAxis
          width={64}
          tick={tickStyle}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => v.toFixed(0)}
          label={{
            angle: -90,
            offset: 12,
            value: yTitle,
            position: "insideLeft",
            style: { fill: "var(--color-muted)", fontSize: 12 },
          }}
        />

        <Tooltip
          labelFormatter={(label) => {
            const f = Number(label);
            const range = getRangeFromValue(f);
            return `${formatFreq(f)} Hz${range ? ` - ${t(`ranges.${range.id}`)}` : ""}`;
          }}
          labelStyle={{ color: "var(--color-muted)", marginBottom: 4 }}
          cursor={{ stroke: "var(--color-muted)", strokeDasharray: "3 3" }}
          formatter={(value: unknown) => `${Number(value ?? 0).toFixed(2)} dB`}
          contentStyle={{
            fontSize: 12,
            borderRadius: 8,
            border: "1px solid var(--color-rule)",
            backgroundColor: "var(--color-paper-2)",
          }}
        />

        <Legend wrapperStyle={{ fontSize: 12 }} />

        {FREQ_RANGES.map((r) => {
          const isHighlighted =
            highlightRegions === r.category || highlightRegions === r.id;

          if (!isHighlighted) return null;

          const color = IEM_COLORS[FREQ_RANGES.indexOf(r) % IEM_COLORS.length];

          return (
            <ReferenceArea
              key={r.id}
              x1={r.x1}
              x2={r.x2}
              fill={color}
              stroke={color}
              fillOpacity={0.2}
              strokeOpacity={0.5}
              className="animated-overlay"
              label={{
                position: "insideTop",
                fill: "var(--color-muted)",
                value: t(`ranges.${r.id}`),
              }}
            />
          );
        })}

        {series.map((s) => (
          <Line
            key={s.key}
            dot={false}
            name={s.label}
            type="monotone"
            dataKey={s.key}
            strokeWidth={2}
            stroke={s.color}
            connectNulls
            strokeDasharray={s.dashed ? "6 4" : undefined}
            animationBegin={300}
            animationDuration={1000}
            animationEasing="ease-in-out"
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
