import type { ChartRow, SeriesMeta } from "@/components/Chart";

export function normalizeAt(db: number[], refIndex: number): number[] {
  const ref = db[refIndex];
  return db.map((v) => Math.round((v - ref) * 100) / 100);
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
