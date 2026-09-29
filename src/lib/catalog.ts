import type { FrPoints, PhoneEntry, TargetEntry } from "@/types";
import { fetchSites, fetchPhoneBook } from "./squig";

export function groupByBrand(entries: PhoneEntry[]): Map<string, PhoneEntry[]> {
  const map = new Map<string, PhoneEntry[]>();
  for (const e of entries) {
    const list = map.get(e.brand) ?? [];
    list.push(e);
    map.set(e.brand, list);
  }
  for (const list of map.values()) {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }
  return new Map([...map.entries()].sort((a, b) => a[0].localeCompare(b[0])));
}

export function searchIems(entries: PhoneEntry[], query: string): PhoneEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return entries;
  return entries.filter(
    (e) =>
      e.name.toLowerCase().includes(q) || e.brand.toLowerCase().includes(q),
  );
}

export type DisplayEntry = PhoneEntry & { showReviewer: boolean };

// Flags entries whose brand+name is shared by another reviewer so duplicates can
// be told apart. Single pass: never scan the whole list per entry (that was O(n^2)
// and froze the page once the catalog hit ~15k devices).
export function buildDisplayEntries(entries: PhoneEntry[]): DisplayEntry[] {
  const counts = new Map<string, number>();
  for (const e of entries) {
    const key = `${e.brand}|${e.name}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return entries.map((e) => ({
    ...e,
    showReviewer: (counts.get(`${e.brand}|${e.name}`) ?? 1) > 1,
  }));
}

// Mean absolute dB difference; only frequencies present in both curves count.
export function meanAbsDeviation(
  a: FrPoints,
  target: FrPoints,
  fMin = 20,
  fMax = 20000,
): number {
  const targetByF = new Map(target.map(([f, spl]) => [f, spl]));
  let sum = 0;
  let n = 0;
  for (const [f, spl] of a) {
    if (f < fMin || f > fMax) continue;
    const other = targetByF.get(f);
    if (other === undefined) continue;
    sum += Math.abs(spl - other);
    n += 1;
  }
  return n ? Math.round((sum / n) * 100) / 100 : 0;
}

export async function fetchAllEntries(): Promise<PhoneEntry[]> {
  const sites = await fetchSites();
  const iemSites = sites.flatMap((site) =>
    site.dbs
      .filter((db) => db.type === "IEMs")
      .map((db) => ({ site, db })),
  );
  const results = await Promise.allSettled(
    iemSites.map(({ site, db }) => fetchPhoneBook(site, db)),
  );
  return results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function fetchTargets(): Promise<TargetEntry[]> {
  const res = await fetch("https://squig.link/data/phone_book.json");
  const brands: { name: string; phones: { name: string; file: string }[] }[] =
    await res.json();
  return brands
    .filter((b) => b.name.startsWith("∆"))
    .flatMap((b) =>
      b.phones.map((p) => ({
        id: slug(p.file),
        name: p.name,
        file: p.file,
        dataBaseUrl: "https://squig.link/data/",
      })),
    );
}
