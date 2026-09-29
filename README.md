# IEM Graph Visualizer

Client-side tool for comparing in-ear monitor frequency responses
against reference targets. All data is fetched during runtime, Client-side from [squig.link](squig.link) sources.

## Stack

- Vite + React 19 + TypeScript + react-router
- i18n via react-i18next (pt-BR and en-US)
- Tailwind CSS v4 + shadcn/ui
- Recharts for log-scale frequency-response plots
- Catppuccin-inspired theme system (Mocha, Kanagawa Wave, Latte),
- Space Grotesk + Source Code Pro

## Run

```bash
pnpm install
pnpm dev       # dev server
pnpm build     # type-check + production build
pnpm preview   # serve the production build
```

## Pages

- `/`: compare IEMs against a target, 1 kHz normalization, shareable URL
- `/library`: searchable brand-grouped catalog
- `/about`: data provenance and credits

## Credits

Frequency responses from AutoEq (MIT), mirrored from squig.link databases.
Measurements by [oratory1990](https://www.reddit.com/user/oratory1990/) and
[Super Review](https://www.youtube.com/@superreview).
