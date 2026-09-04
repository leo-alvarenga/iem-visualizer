import type { FrData, IemMeta } from "@/types";

export function groupByBrand(iems: IemMeta[]): Map<string, IemMeta[]> {
  const map = new Map<string, IemMeta[]>();
  for (const iem of iems) {
    const list = map.get(iem.brand) ?? [];
    list.push(iem);
    map.set(iem.brand, list);
  }
  for (const list of map.values()) list.sort((a, b) => a.name.localeCompare(b.name));
  return new Map([...map.entries()].sort((a, b) => a[0].localeCompare(b[0])));
}

export function searchIems(iems: IemMeta[], query: string): IemMeta[] {
  const q = query.trim().toLowerCase();
  if (!q) return iems;
  return iems.filter(
    (i) => i.name.toLowerCase().includes(q) || i.brand.toLowerCase().includes(q),
  );
}

// Mean absolute dB difference; only frequencies present in both curves count.
export function meanAbsDeviation(
  a: FrData,
  b: FrData,
  fMin = 20,
  fMax = 10000,
): number {
  const bByF = new Map(b.raw.map(([f, db]) => [f, db]));
  let sum = 0;
  let n = 0;
  for (const [f, db] of a.raw) {
    if (f < fMin || f > fMax) continue;
    const other = bByF.get(f);
    if (other === undefined) continue;
    sum += Math.abs(db - other);
    n += 1;
  }
  return n ? Math.round((sum / n) * 100) / 100 : 0;
}
