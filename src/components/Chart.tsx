import { useTranslation } from "react-i18next";
import {
  DBS_TICKS,
  FREQ_MAX,
  FREQ_MIN,
  FREQ_RANGES,
  FREQ_TICKS,
} from "@/lib/constants";
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
  type TooltipPayloadEntry,
} from "recharts";
import { useState, type Ref } from "react";
import type { NameType } from "recharts/types/component/DefaultTooltipContent";

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
  ref?: Ref<HTMLDivElement>;
  zoomInHighlight?: boolean;
  highlightRegions?: string | RangeCategory;
}

function formatFreq(f: number): string {
  return f >= 1000 ? `${(f / 1000).toFixed(3)}k` : String(f);
}

function getHighlightRange(
  highlightRegions?: string | RangeCategory,
): [number, number] | null {
  if (!highlightRegions || highlightRegions.length === 0) return null;

  const ranges = FREQ_RANGES.filter(
    (range) =>
      highlightRegions === range.id || highlightRegions === range.category,
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
  return FREQ_RANGES.find((range) => value >= range.x1 && value <= range.x2);
}

function tooltipFormatter(data: ChartRow[], series: SeriesMeta[]) {
  const isValid = (value: unknown) => !isNaN(Number(value));

  return (value: unknown, name?: NameType, item?: TooltipPayloadEntry) => {
    if (isValid(value)) return `${Number(value ?? 0).toFixed(2)} dB`;

    try {
      if (!item || !name) throw new Error("Invalid data");

      const f: number | null = item.payload?.f ?? null;
      const key = series.find((s) => s.label === name)?.key;
      const dataIndex = data.findIndex((d) => d.f === f);

      if (!key || typeof dataIndex !== "number") {
        throw new Error("Invalid data");
      }

      let i = dataIndex;
      let j = dataIndex + 1;
      let val: number | null = null;

      while (i >= 0 && j < data.length) {
        val = data[i]?.[key] ?? data[j]?.[key];

        if (isValid(val)) {
          const finalIndex = val === data[i]?.[key] ? i : j;
          return `${val.toFixed(2)} dB (@ ${formatFreq(data[finalIndex]?.f ?? 0)} Hz)`;
        }

        i--;
        j++;
      }
    } catch (e) {
      console.log(e);
      return "N/A";
    }

    return "N/A";
  };
}

const tickStyle = { fontSize: 11 };

export function Chart({
  ref,
  data,
  series,
  yTitle,
  zoomInHighlight,
  highlightRegions,
}: ChartProps) {
  const { t } = useTranslation();
  const [active, setActive] = useState<string | null>(null);

  if (series.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-(--color-muted)">
        {t("chart.empty")}
      </div>
    );
  }

  return (
    <ResponsiveContainer ref={ref} width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
      >
        <CartesianGrid stroke="var(--color-rule)" strokeDasharray="3 3" />

        <XAxis
          axisLine
          tickLine
          dataKey="f"
          scale="log"
          type="number"
          tickMargin={8}
          tick={tickStyle}
          allowDataOverflow
          ticks={FREQ_TICKS}
          tickFormatter={formatFreq}
          domain={
            zoomInHighlight
              ? (getHighlightRange(highlightRegions) ?? [FREQ_MIN, FREQ_MAX])
              : [FREQ_MIN, FREQ_MAX]
          }
        />

        <YAxis
          axisLine
          tickLine
          width={64}
          tick={tickStyle}
          ticks={DBS_TICKS}
          tickFormatter={(v: number) => v.toFixed(0)}
          label={{
            angle: -90,
            offset: 12,
            value: yTitle,
            position: "insideLeft",
            style: { fontSize: 12 },
          }}
        />

        <Tooltip
          filterNull={false}
          formatter={tooltipFormatter(data, series)}
          labelStyle={{
            color: "var(--color-muted)",
            marginBottom: 4,
            fontSize: 14,
          }}
          cursor={{ stroke: "var(--color-muted)", strokeDasharray: "3 3" }}
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

        <Legend wrapperStyle={{ fontSize: 12 }} />

        {FREQ_RANGES.map((r) => {
          const isHighlighted =
            highlightRegions === r.category || highlightRegions === r.id;

          const color = IEM_COLORS[FREQ_RANGES.indexOf(r) % IEM_COLORS.length];

          return (
            <ReferenceArea
              key={r.id}
              x1={r.x1}
              x2={r.x2}
              fill={color}
              stroke={color}
              fillOpacity={isHighlighted ? 0.2 : 0.05}
              strokeOpacity={isHighlighted ? 0.5 : 0.2}
              className="animated-overlay"
              label={
                isHighlighted
                  ? {
                      position: "insideTop",
                      fill: "var(--color-muted)",
                      value: t(`ranges.${r.id}`),
                    }
                  : undefined
              }
            />
          );
        })}

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
            onMouseLeave={() => setActive(null)}
            onMouseEnter={() => setActive(s.key)}
            strokeDasharray={s.dashed ? "12 8" : undefined}
            strokeOpacity={!active || active === s.key ? 1 : 0.5}
            onClick={() => setActive((curr) => (curr === s.key ? null : s.key))}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
