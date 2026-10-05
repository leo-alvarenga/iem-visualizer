import type { TooltipPayloadEntry } from "recharts";
import type { NameType } from "recharts/types/component/DefaultTooltipContent";

import { FREQ_RANGES } from "@/lib/constants";
import type { NamedRange, RangeCategory } from "@/types";

import type { ChartRow, SeriesMeta } from "./Chart.types";

export function formatFreq(f: number): string {
  return f >= 1000 ? `${(f / 1000).toFixed(3)}k` : String(f);
}

export function getHighlightRange(
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

export function getRangeFromValue(value: number): NamedRange | undefined {
  return FREQ_RANGES.find((range) => value >= range.x1 && value <= range.x2);
}

const isValid = (value: unknown) => !isNaN(Number(value));

export function interpolateAt(
  data: ChartRow[],
  key: string,
  index: number,
): number | null {
  let lo = index - 1;
  let hi = index + 1;

  while (lo >= 0 && !isValid(data[lo][key])) lo--;
  while (hi < data.length && !isValid(data[hi][key])) hi++;

  if (lo < 0 || hi >= data.length) return null;

  const x0 = data[lo].f,
    y0 = data[lo][key];
  const x1 = data[hi].f,
    y1 = data[hi][key];
  const x = data[index].f;

  return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
}

export function getTooltipValue(
  data: ChartRow[],
  series: SeriesMeta[],
  value: unknown,
  name?: NameType,
  item?: TooltipPayloadEntry,
): [number | null, number | null] {
  if (isValid(value)) return [Number(value), item?.payload?.f ?? null];

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

        return [val, data[finalIndex]?.f];
      }

      i--;
      j++;
    }
    //
  } catch {
    //
  }

  return [null, null];
}
