import type { Capabilities, FrData } from "../types";

// Module-level curve cache survives component remounts
const curveCache = new Map<string, FrData>();

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);

  return res.json() as Promise<T>;
}

export function fetchCapabilities(): Promise<Capabilities> {
  return fetchJson<Capabilities>("/data/capabilities.json");
}

export async function fetchCurve(meta: { file: string }): Promise<FrData> {
  const cached = curveCache.get(meta.file);
  if (cached) return cached;

  const data = await fetchJson<FrData>(meta.file);
  curveCache.set(meta.file, data);

  return data;
}
