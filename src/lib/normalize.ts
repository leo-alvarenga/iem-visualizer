import type { FrData } from "@/types";
import type { ChartRow, SeriesMeta } from "@/components/Chart";

export function find1kHzIndex(freqs: number[]): number {
  let best = 0;
  let bestDiff = Infinity;

  for (let i = 0; i < freqs.length; i++) {
    const diff = Math.abs(freqs[i] - 1000);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = i;
    }
  }

  return best;
}

export function normalizeAt(db: number[], refIndex: number): number[] {
  const ref = db[refIndex];
  return db.map((v) => round(v - ref));
}

export function normalizeCurve(
  data: FrData,
  normalize: boolean,
): [number, number][] {
  const x = data.raw.map((p) => p[0]);
  let y = data.raw.map((p) => p[1]);
  if (normalize) y = normalizeAt(y, find1kHzIndex(x));
  return x.map((f, i) => [f, y[i]]);
}

export function mergeSeries(
  raw: { meta: SeriesMeta; points: [number, number][] }[],
): ChartRow[] {
  const map = new Map<number, ChartRow>();
  for (const { meta, points } of raw) {
    for (const [f, db] of points) {
      const row = map.get(f) ?? ({ f } as ChartRow);
      row[meta.key] = db;
      map.set(f, row);
    }
  }
  return [...map.values()].sort((a, b) => a.f - b.f);
}

function round(x: number): number {
  return Math.round(x * 100) / 100;
}
