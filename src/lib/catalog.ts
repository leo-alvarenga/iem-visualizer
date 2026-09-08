import type { FrData, IemMeta } from "@/types";

export function groupByBrand(iems: IemMeta[]): Map<string, IemMeta[]> {
  const map = new Map<string, IemMeta[]>();

  for (const iem of iems) {
    const list = map.get(iem.brand) ?? [];
    list.push(iem);
    map.set(iem.brand, list);
  }

  for (const list of map.values()) {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }

  return new Map([...map.entries()].sort((a, b) => a[0].localeCompare(b[0])));
}

export function searchIems(iems: IemMeta[], query: string): IemMeta[] {
  const q = query.trim().toLowerCase();
  if (!q) return iems;
  return iems.filter(
    (i) =>
      i.name.toLowerCase().includes(q) || i.brand.toLowerCase().includes(q),
  );
}

// Mean absolute dB difference; only frequencies present in both curves count.
export function meanAbsDeviation(
  a: [number, number][],
  target: FrData,
  fMin = 20,
  fMax = 20000,
): number {
  const targetByF = new Map(target.raw.map(([f, dtarget]) => [f, dtarget]));
  let sum = 0;
  let n = 0;

  for (const [f, dtarget] of a) {
    if (f < fMin || f > fMax) continue;

    const other = targetByF.get(f);
    if (other === undefined) continue;

    sum += Math.abs(dtarget - other);
    n += 1;
  }

  return n ? Math.round((sum / n) * 100) / 100 : 0;
}
