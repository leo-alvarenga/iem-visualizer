import type { ChartRow, SeriesMeta } from "@/components/Chart";
import type { FrPoints } from "@/types";

// squig.link default: normalize so the 500 Hz point lands at 60 dB SPL.
// (ISO loudness "dB" mode is complex; this Hz approximation matches squig.link closely.)
const NORM_REF_HZ = 500;
const NORM_REF_DB = 60;

export function normalizeFr(
  points: FrPoints,
  refHz = NORM_REF_HZ,
  refDb = NORM_REF_DB,
): FrPoints {
  if (points.length === 0) return points;
  let ref = points[0];
  for (const p of points) {
    if (Math.abs(p[0] - refHz) < Math.abs(ref[0] - refHz)) ref = p;
  }
  const offset = refDb - ref[1];
  return points.map(([f, spl]) => [f, Math.round((spl + offset) * 100) / 100]);
}

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
