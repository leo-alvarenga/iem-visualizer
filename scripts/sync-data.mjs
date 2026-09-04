import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA_DIR = join(ROOT, "public", "data");
const AUTOEQ_SHA = "7ae0f56d53074872b028649617a22bbb4232feb7";
const RAW_BASE = `https://raw.githubusercontent.com/jaakkopasanen/AutoEq/${AUTOEQ_SHA}`;
const UA = { "User-Agent": "Mozilla/5.0" };

const FORM = "in-ear";
const RIGS = {
  oratory1990: "GRAS RA0045 (IEC 60318-4)",
  "Super Review": "IEC 60318-4 (711 coupler)",
};
const DEFAULT_SOURCE = "oratory1990";

// Curated popular IEMs. `f` is the file name inside AutoEq when it differs
// from the display name; `s` is the measurement source (default oratory1990)
const IEMS = [
  { n: "Moondrop Aria", b: "Moondrop" },
  { n: "Moondrop Aria Snow Edition", b: "Moondrop", s: "Super Review" },
  { n: "Moondrop Blessing 2", b: "Moondrop" },
  { n: "Moondrop Blessing 3", b: "Moondrop", s: "Super Review" },
  { n: "Moondrop Chu", b: "Moondrop" },
  {
    n: "Moondrop Chu II",
    b: "Moondrop",
    s: "Super Review",
    f: "Moondrop Chu 2",
  },
  { n: "Moondrop Quarks", b: "Moondrop" },
  { n: "Moondrop Quarks DSP", b: "Moondrop" },
  { n: "Moondrop Starfield", b: "Moondrop" },
  { n: "Moondrop Variations", b: "Moondrop" },
  { n: "Moondrop x Crinacle Blessing2 Dusk", b: "Moondrop" },
  { n: "7Hz Salnotes Zero", b: "7Hz" },
  {
    n: "7Hz Salnotes Zero:2",
    b: "7Hz",
    s: "Super Review",
    f: "7Hz x Crinacle Zero 2",
  },
  { n: "7Hz Salnotes Dioko", b: "7Hz" },
  { n: "7Hz Timeless", b: "7Hz" },
  { n: "Truthear x Crinacle Zero", b: "Truthear" },
  { n: "Truthear x Crinacle Zero RED", b: "Truthear" },
  { n: "Truthear Hexa", b: "Truthear" },
  { n: "Truthear Nova", b: "Truthear" },
  { n: "Truthear Gate", b: "Truthear" },
  { n: "Kiwi Ears Orchestra Lite", b: "Kiwi Ears" },
  { n: "Kiwi Ears Cadenza", b: "Kiwi Ears", s: "Super Review" },
  { n: "Etymotic ER2SE", b: "Etymotic" },
  { n: "Etymotic ER2XR", b: "Etymotic" },
  { n: "Etymotic ER4SR", b: "Etymotic" },
  { n: "Etymotic ER4XR", b: "Etymotic" },
  { n: "Shuoer S12", b: "Shuoer" },
  { n: "Shuoer S12 Pro", b: "Shuoer" },
  { n: "Tin HiFi T2", b: "Tin HiFi" },
  { n: "Tin HiFi T2 Plus", b: "Tin HiFi" },
  { n: "Tin HiFi T3", b: "Tin HiFi" },
  { n: "Tin HiFi P1", b: "Tin HiFi" },
  { n: "Simgot Audio EW100P", b: "Simgot" },
  { n: "Sennheiser IE 200", b: "Sennheiser" },
  { n: "Sennheiser IE 600", b: "Sennheiser" },
  { n: "Sennheiser IE 900", b: "Sennheiser" },
  { n: "Final Audio E1000", b: "Final Audio" },
  { n: "Final Audio E5000", b: "Final Audio" },
  { n: "Final Audio A8000", b: "Final Audio" },
  { n: "Sony IER-M7", b: "Sony" },
  { n: "Sony IER-M9", b: "Sony" },
  { n: "Sony IER-Z1R", b: "Sony" },
  { n: "BLON BL-03", b: "BLON" },
  { n: "Campfire Audio Andromeda", b: "Campfire Audio" },
  { n: "Campfire Audio Vega (foam eartips)", b: "Campfire Audio" },
  { n: "ThieAudio Monarch", b: "ThieAudio" },
  { n: "Meze Rai Penta", b: "Meze" },
];

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

async function fetchCsv(url) {
  const res = await fetch(url, { headers: UA });
  if (!res.ok) throw new Error(`${res.status} ${url}`);

  return res.text();
}

function parseCsv(text) {
  const lines = text.trim().split("\n");
  const head = lines[0].split(",");

  const fIdx = head.indexOf("frequency");
  const rIdx = head.indexOf("raw");

  if (fIdx < 0 || rIdx < 0) throw new Error(`unexpected CSV header: ${head}`);

  const points = [];

  for (const line of lines.slice(1)) {
    if (!line) continue;

    const cols = line.split(",");
    const f = Number(cols[fIdx]);
    const db = Number(cols[rIdx]);

    if (!Number.isFinite(f) || !Number.isFinite(db)) continue;
    if (f < 20 || f > 20000) continue;

    points.push([Math.round(f * 100) / 100, Math.round(db * 100) / 100]);
  }

  if (points.length < 50) throw new Error(`only ${points.length} points`);

  return points;
}

async function main() {
  await mkdir(join(DATA_DIR, "iems"), { recursive: true });

  const iems = [];
  let ok = 0;
  let failed = 0;

  for (const { n, b, s, f } of IEMS) {
    const source = s ?? DEFAULT_SOURCE;
    const fileName = f ?? n;

    const id = slug(n);
    const url = `${RAW_BASE}/measurements/${source}/data/${FORM}/${encodeURIComponent(fileName)}.csv`;

    try {
      const raw = parseCsv(await fetchCsv(url));

      const meta = {
        id,
        name: n,
        brand: b,
        source,
        rig: RIGS[source] ?? source,
        form: FORM,
        file: `/data/iems/${id}.json`,
      };

      await writeFile(
        join(DATA_DIR, "iems", `${id}.json`),
        JSON.stringify({ ...meta, raw }, null, 2),
      );

      iems.push(meta);
      console.log(`  ok  ${n}`);
      ok += 1;
    } catch (e) {
      console.warn(`  SKIP ${n} — ${e.message}`);
      failed += 1;
    }
  }

  // Targets are static published reference curves, kept as-is in public/data/targets
  const targets = [
    {
      id: "harman-2019",
      name: "Harman Target 2019",
      file: "/data/targets/harman-2019.json",
    },
  ];

  iems.sort((a, b) => a.name.localeCompare(b.name));

  await writeFile(
    join(DATA_DIR, "capabilities.json"),
    JSON.stringify({ iems, targets }, null, 2),
  );

  console.log(`\n${ok} IEMs written, ${failed} skipped (not in AutoEq).`);
  if (failed > 0) process.exitCode = 1;
}

main();
