import type { NamedRange } from "@/types";

export const FREQ_MIN = 20;
export const FREQ_MAX = 20000;
export const NORMALIZE_HZ = 1000;

export const FREQ_TICKS = [
  30, 40, 50, 60, 80, 100, 150, 200, 300, 400, 500, 600, 800, 1000, 1500, 2000,
  3000, 4000, 5000, 6000, 8000, 10000, 15000, 20000,
];

export const FREQ_RANGES: NamedRange[] = [
  { x1: 20, x2: 80, id: "sub-bass", category: "Bass" },
  { x1: 80, x2: 300, id: "mid-bass", category: "Bass" },
  { x1: 300, x2: 1000, id: "lower-mid", category: "Mid" },
  { x1: 1000, x2: 4000, id: "upper-mid", category: "Mid" },
  { x1: 4000, x2: 6000, id: "presence", category: "Treble" },
  { x1: 6000, x2: 10000, id: "mid-treble", category: "Treble" },
  { x1: 10000, x2: 20000, id: "air", category: "Treble" },
];
