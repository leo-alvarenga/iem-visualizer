# IEM Graph Visualizer

Client-side tool for comparing in-ear monitor frequency responses
against reference targets (squig.link style). No backend: data is fetched
from `/public/data/*.json`.

## Stack

- Vite + React 19 + TypeScript + react-router
- i18n via react-i18next (pt-BR · en-US)
- Tailwind CSS v4 + shadcn/ui
- Recharts for log-scale frequency-response plots
- Catppuccin-inspired theme system (Mocha, Kanagawa Wave, Latte),
  Space Grotesk + Source Code Pro

## Run

```bash
pnpm install
pnpm dev       # dev server
pnpm build     # type-check + production build
pnpm preview   # serve the production build
```

## Data

Curves are a curated snapshot of popular IEMs from
[AutoEq](https://github.com/jaakkopasanen/AutoEq), which mirrors the
[squig.link](https://squig.link) measurement ecosystem. Sources:
oratory1990 (GRAS RA0045) and Super Review (IEC 60318-4).

Regenerate the snapshot with:

```bash
pnpm data
```

This downloads each curve from AutoEq (pinned commit) and writes it as
`[Hz, dB]` tuples under:

```text
public/data/
├── capabilities.json      # manifest of IEMs + targets
├── iems/*.json            # FrData: id, name, brand, source, rig, raw
└── targets/*.json         # reference target curves
```

## Pages

- `/` - compare IEMs against a target, 1 kHz normalization, shareable URL
- `/library` - searchable brand-grouped catalog
- `/iem/:id` - single IEM vs Harman target, deviation stat
- `/about` - data provenance and credits

## Credits

Frequency responses from AutoEq (MIT), mirrored from squig.link databases.
Measurements by [oratory1990](https://www.reddit.com/user/oratory1990/) and
[Super Review](https://www.youtube.com/@superreview).
