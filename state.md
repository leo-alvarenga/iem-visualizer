# IEM Visualizer — Session State

## What was done

### 1. React-Query migration (complete)
All fetching moved from `useEffect`+`useState` to `@tanstack/react-query`.

**Files changed:**
- `src/main.tsx` — added `QueryClientProvider` + `TooltipProvider`
- `src/components/ui/tooltip.tsx` — new, thin radix-ui wrapper
- `src/hooks/useSquigStatus.ts` — replaced with `useQuery`
- `src/hooks/useSquigCatalog.ts` — replaced with `useQuery` + `useQueries` (fan-out per phonebook)
- `src/hooks/useSquigCurves.ts` — replaced with `useQueries`, now exposes `errorIds: Set<string>`
- `src/lib/squig/measurements.ts` — dropped module-level `measurementCache`/`errorCache`/`hasError()`
- `src/components/DeviceSelector/components/DeviceSelectorResults.tsx` — accepts `errorIds` prop, wraps errored items in `<Tooltip>` with `text-destructive`
- `src/components/DeviceSelector/DeviceSelector.tsx` — threads `errorIds` prop
- `src/pages/ComparePage/ComparePage.tsx` — passes `errorIds` to `DeviceSelector`
- `src/pages/LibraryPage/hooks/useLibraryChart.ts` — exposes `errorIds`
- `src/pages/LibraryPage/LibraryPage.tsx` — uses `errorIds` from hook
- `src/pages/LibraryPage/components/LibraryDetailPanel.tsx` — accepts `hasError` prop (was using stale module-level `hasError()`)

**Bug fixed in `LibraryDetailPanel`:** the `hasError` condition was inverted (showed destructive when no error).

### 2. Normalization (partially done, needs fix)

**Current state (WRONG):** `src/lib/normalize.ts` has `NORM_REF_DB = 58`, `NORM_REF_HZ = 1000`.
`normalizeFr()` is called in `fetchMeasurementCoalesced` and `fetchTargetPoints` in `measurements.ts`.

**What squig.link actually does (discovered this session):**
- Reads `config.js` from each reviewer subdomain (e.g. `achoreviews.squig.link/config.js`)
- Default normalization: `default_normalization = "dB"` (ISO 226 loudness), `default_norm_db = 60`, `default_norm_hz = 500`
- "dB" mode = ISO loudness normalization to 60 phons (complex, uses equal-loudness contours)
- "Hz" mode = simple: shift curve so value at `default_norm_hz` Hz equals `default_norm_db` dB
- The Hz approximation (500 Hz → 60 dB) gives 72.85 dB at 20 Hz for 7Hz Aero vs user-observed ~70 dB on squig.link ✓

**What needs to be done:**
1. Fix `NORM_REF_HZ = 1000 → 500` and `NORM_REF_DB = 58 → 60` in `src/lib/normalize.ts`
2. Optionally: make per-provider by fetching `config.js` from each site subdomain when loading catalog
   - Most sites don't have a custom config.js (oratory1990, crinacle → 404); falls back to defaults
   - Only worth doing if a site genuinely differs from 500 Hz / 60 dB
3. Full ISO loudness normalization would require implementing ISO 226 equal-loudness contours — significant work, probably YAGNI given the Hz approximation is close

**Empirical verification (7Hz Aero, Acho Reviews):**
- Raw file: `https://achoreviews.squig.link/data/7Hz%20Aero%20L.txt`
- Raw 20.6 Hz: 102.903 dB | Raw 500 Hz: 90.050 dB | Raw 1 kHz: 90.715 dB
- After 500 Hz / 60 dB normalization: 20.6 Hz → 72.85 dB (squig.link shows ~70 ✓)

## Key files

```
src/lib/normalize.ts          ← normalizeFr(), NORM_REF_HZ, NORM_REF_DB
src/lib/squig/measurements.ts ← normalizeFr called on fetchMeasurementCoalesced + fetchTargetPoints
src/hooks/useSquigCatalog.ts  ← useQuery(squig-sites) + useQueries(phonebooks) + useQuery(targets)
src/hooks/useSquigCurves.ts   ← useQueries per entry, exposes errorIds
```

## Immediate next action

Open `src/lib/normalize.ts`, change:
```ts
const NORM_REF_HZ = 1000;  →  const NORM_REF_HZ = 500;
const NORM_REF_DB = 58;    →  const NORM_REF_DB = 60;
```

Then verify the 7Hz Aero chart matches squig.link's display.

## squig.link config.js location

`https://{username}.squig.link/config.js` — exists for some reviewers, 404 for most.
Parse `default_norm_db` and `default_norm_hz` if present, fall back to 60/500.
