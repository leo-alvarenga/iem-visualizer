import type { FrData } from "@/types";
import type { ChartRow, SeriesMeta } from "@/components/Chart";

export function normalizeAt(db: number[], refIndex: number): number[] {
  const ref = db[refIndex];

  return db.map((v) => round(v - ref));
}

export function normalizeCurve(
  data: FrData,
  target?: FrData,
): [number, number][] {
  const getBaseline = (index: number) => {
    if (!target) return 0;

    const [x] = data.raw[index];

    let closest = 0;
    for (let i = 0; i < (target?.raw?.length ?? 0); i++) {
      if (x < target.raw[i][0]) break;

      closest = i;
    }

    return target?.raw?.[closest]?.[1] ?? 0;
  };

  const x = data.raw.map((p) => p[0]);
  let y = data.raw.map((p, i) => p[1] + getBaseline(i));

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
