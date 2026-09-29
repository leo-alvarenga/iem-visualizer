import type { PhoneEntry, TargetEntry, FrPoints } from "@/types";

const measurementCache = new Map<string, FrPoints>();
const errorCache = new Map<string, boolean>();

export function getCacheKey(entry: PhoneEntry | TargetEntry, isTarget = false) {
  return `${isTarget ? "target:" : ""}${entry.id}`;
}

export function hasError(id: string) {
  return errorCache.get(id) ?? false;
}

export async function fetchMeasurement(
  entry: PhoneEntry,
  channel: "L" | "R",
): Promise<FrPoints> {
  const url = `${entry.dataBaseUrl}${encodeURIComponent(`${entry.file} ${channel}`)}.txt`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);

  return parseMeasurementText(await res.text());
}

export async function fetchTargetPoints(entry: TargetEntry): Promise<FrPoints> {
  const cacheKey = getCacheKey(entry, true);
  const cached = measurementCache.get(cacheKey);
  if (cached) return cached;

  const url = `${entry.dataBaseUrl}${encodeURIComponent(entry.file)}.txt`;
  const res = await fetch(url);

  if (!res.ok) {
    errorCache.set(cacheKey, true);

    throw new Error(`${res.status} ${url}`);
  }

  const points = parseMeasurementText(await res.text());
  measurementCache.set(cacheKey, points);

  return points;
}

// L/R coalesce: average if both succeed, else use whichever resolves
export async function fetchMeasurementCoalesced(
  entry: PhoneEntry,
): Promise<{ points: FrPoints; channel: "AVG" | "L" | "R" }> {
  const cacheKey = getCacheKey(entry);
  const cached = measurementCache.get(cacheKey);
  if (cached) return { points: cached, channel: "AVG" };

  const [lResult, rResult] = await Promise.allSettled([
    fetchMeasurement(entry, "L"),
    fetchMeasurement(entry, "R"),
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
    errorCache.set(cacheKey, true);
    throw new Error(`Could not fetch measurement for ${entry.file}`);
  }

  measurementCache.set(cacheKey, points);
  return { points, channel };
}

export function parseMeasurementText(text: string): FrPoints {
  return text
    .split("\n")
    .filter((l) => l && !l.startsWith("*") && !/^Freq/i.test(l.trim()))
    .map((l) => {
      const [f, spl] = l.trim().split(/\s+/);

      return [parseFloat(f), parseFloat(spl)] as [number, number];
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
