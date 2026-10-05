import type { Ref } from "react";

import type { RangeCategory } from "@/types";

export interface SeriesMeta {
  key: string;
  label: string;
  color: string;
  dashed?: boolean;
}

// One row per frequency; series keys plus the shared `f` column.
export type ChartRow = { f: number } & Record<string, number>;

export interface ChartProps {
  xTitle: string;
  yTitle: string;
  data: ChartRow[];
  targetName?: string;
  series: SeriesMeta[];
  ref?: Ref<HTMLDivElement>;
  zoomInHighlight?: boolean;
  highlightRegions?: string | RangeCategory;
}
