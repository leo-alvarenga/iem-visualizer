import type { PhoneEntry, TargetEntry, FrPoints } from "@/types";
import { QUERY_TIMEOUT } from "../constants";
import { normalizeFr } from "@/lib/normalize";

export function getCacheKey(entry: PhoneEntry | TargetEntry, isTarget = false) {
  return `${isTarget ? "target:" : ""}${entry.id}`;
}

export async function fetchMeasurement(
  entry: PhoneEntry,
  channel: "L" | "R",
  signal: AbortSignal,
): Promise<FrPoints> {
  const url = `${entry.dataBaseUrl}${encodeURIComponent(`${entry.file} ${channel}`)}.txt`;

  const res = await fetch(url, {
    signal: AbortSignal.any([signal, AbortSignal.timeout(QUERY_TIMEOUT)]),
  });

  if (!res.ok) throw new Error(`${res.status} ${url}`);

  return parseMeasurementText(await res.text());
}

export async function fetchTargetPoints(
  entry: TargetEntry,
  signal: AbortSignal,
): Promise<FrPoints> {
  const url = `${entry.dataBaseUrl}${encodeURIComponent(entry.file)}.txt`;

  const res = await fetch(url, {
    signal: AbortSignal.any([signal, AbortSignal.timeout(QUERY_TIMEOUT)]),
  });

  if (!res.ok) throw new Error(`${res.status} ${url}`);

  return normalizeFr(parseMeasurementText(await res.text()));
}

export async function fetchMeasurementCoalesced(
  entry: PhoneEntry,
  signal: AbortSignal,
): Promise<{ points: FrPoints; channel: "AVG" | "L" | "R" }> {
  const [lResult, rResult] = await Promise.allSettled([
    fetchMeasurement(entry, "L", signal),
    fetchMeasurement(entry, "R", signal),
  ]);

  let points: FrPoints;
  let channel: "AVG" | "L" | "R";

  if (lResult.status === "fulfilled" && rResult.status === "fulfilled") {
    points = averageChannels(lResult.value, rResult.value);
    channel = "AVG";
  } else if (lResult.status === "fulfilled") {
    points = lResult.value;
    channel = "L";
  } else if (rResult.status === "fulfilled") {
    points = rResult.value;
    channel = "R";
  } else {
    throw new Error(`Could not fetch measurement for ${entry.file}`);
  }

  return { points: normalizeFr(points, entry.normHz, entry.normDb), channel };
}

export function parseMeasurementText(text: string): FrPoints {
  return text
    .split("\n")
    .filter((l) => l && !l.startsWith("*") && !/^Freq/i.test(l.trim()))
    .map<[number, number]>((l) => {
      const [f, spl] = l.trim().split(/\s+/);
      return [parseFloat(f), parseFloat(spl)];
    })
    .filter(([f, spl]) => !isNaN(f) && !isNaN(spl));
}

function averageChannels(l: FrPoints, r: FrPoints): FrPoints {
  const rMap = new Map(r.map(([f, spl]) => [f, spl]));
  return l.map(([f, spl]) => {
    const rSpl = rMap.get(f);

    return [f, rSpl !== undefined ? (spl + rSpl) / 2 : spl];
  });
}
