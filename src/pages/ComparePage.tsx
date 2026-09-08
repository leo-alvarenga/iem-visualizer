import { useMemo, useRef, useState, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { Chart, type ChartRow, type SeriesMeta } from "@/components/Chart";
import { PageState } from "@/components/PageState";
import { MultiSelect } from "@/components/MultiSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCapabilities } from "@/hooks/useCapabilities";
import { useCurves } from "@/hooks/useCurves";
import { FREQ_RANGES } from "@/lib/constants";
import { mergeSeries, normalizeCurve } from "@/lib/normalize";
import { IEM_COLORS, TARGET_COLOR } from "@/lib/palette";
import { useFullscreen } from "@/hooks/useFullscreen";
import { Maximize, Minimize } from "lucide-react";

function readIds(param: string | null, fallback: string[]): string[] {
  if (param === null) return fallback;
  const ids = param.split(",").filter(Boolean);

  return ids.length ? ids : fallback;
}

export function ComparePage() {
  const chartRef = useRef<HTMLDivElement>(null);
  const { toggle, isFullscreen } = useFullscreen(chartRef);

  const { t } = useTranslation();
  const { caps, error } = useCapabilities();
  const [searchParams, setSearchParams] = useSearchParams();

  const [zoomIn, setZoomIn] = useState(false);

  const selectedIems = useMemo(
    () => readIds(searchParams.get("iem"), caps ? [caps.iems[0].id] : []),
    [searchParams, caps],
  );

  const targetId = useMemo(
    () => searchParams.get("target") ?? caps?.targets[0]?.id ?? "",
    [searchParams, caps],
  );

  const targetName = useMemo(
    () => caps?.targets.find((t) => t.id === targetId)?.name ?? "",
    [targetId, caps],
  );

  const highlightRegion = searchParams.get("region") ?? "none";

  const updateParams = (
    iems: string[],
    target: string,
    highlightRegion?: string,
  ) => {
    const next = new URLSearchParams();

    next.set("iem", iems.join(","));
    if (target) next.set("target", target);

    if (highlightRegion) next.set("region", highlightRegion);
    else next.delete("region");

    setSearchParams(next, { replace: true });
  };

  const metas = useMemo(() => {
    if (!caps) return [];
    return [
      ...caps.iems.filter((i) => selectedIems.includes(i.id)),
      ...caps.targets.filter((t) => t.id === targetId),
    ];
  }, [caps, selectedIems, targetId]);

  const { curves, pending } = useCurves(metas);

  const { series, data } = useMemo(() => {
    if (!caps) return { series: [] as SeriesMeta[], data: [] as ChartRow[] };
    const raw: { meta: SeriesMeta; points: [number, number][] }[] = [];
    const series: SeriesMeta[] = [];

    caps.targets
      .filter((t) => t.id === targetId)
      .forEach((meta) => {
        const d = curves.get(meta.id);
        if (!d) return;

        const m = {
          dashed: true,
          label: meta.name,
          color: TARGET_COLOR,
          key: `target:${meta.id}`,
        };

        series.push(m);
        raw.push({ meta: m, points: normalizeCurve(d) });
      });

    caps.iems
      .filter((i) => selectedIems.includes(i.id))
      .forEach((meta, idx) => {
        const d = curves.get(meta.id);
        if (!d) return;

        const m = {
          key: `iem:${meta.id}`,
          label: meta.name,
          color: IEM_COLORS[idx % IEM_COLORS.length],
        };

        series.push(m);

        raw.push({
          meta: m,
          points: normalizeCurve(d, curves.get(targetId)),
        });
      });

    return { series, data: mergeSeries(raw) };
  }, [caps, selectedIems, targetId, curves]);

  if (!caps) {
    return (
      <PageState>
        {error ? t("common.loadError", { error }) : t("common.loading")}
      </PageState>
    );
  }

  const selectIems = (ids: string[]) => updateParams(ids, targetId);
  const selectTarget = (id: string) => updateParams(selectedIems, id);

  const selectRegion = (id: string) => {
    updateParams(selectedIems, targetId, id === "none" ? undefined : id);

    if (id === "none") setZoomIn(false);
  };

  return (
    <div
      style={{ "--i": 0 } as CSSProperties}
      className="reveal flex flex-1 flex-col gap-6"
    >
      <header className="flex flex-col gap-3">
        <span className="font-code text-sm tracking-[0.2em] text-(--color-accent)">
          ~/compare
        </span>

        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {t("compare.title")}
        </h1>

        <p className="max-w-xl text-sm text-(--color-muted)">
          {t("compare.subtitle")}
        </p>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
        <aside className="flex shrink-0 flex-col gap-5 lg:w-72">
          <MultiSelect
            label={t("compare.iemsLabel")}
            options={caps.iems.map((i) => ({ id: i.id, name: i.name }))}
            selected={selectedIems}
            onChange={selectIems}
          />

          <Field label={t("compare.targetLabel")}>
            <Select value={targetId} onValueChange={selectTarget}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("compare.targetLabel")} />
              </SelectTrigger>

              <SelectContent>
                {caps.targets.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label={t("compare.regionLabel")}>
            <Select value={highlightRegion} onValueChange={selectRegion}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("compare.regionPlaceholder")} />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="none">
                  {t("compare.regionPlaceholder")}
                </SelectItem>

                {FREQ_RANGES.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {t(`ranges.${r.id}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <label className="flex items-center justify-between gap-3 text-sm">
            {t("compare.zoomInRegionLabel")}
            <Switch
              checked={zoomIn}
              onCheckedChange={setZoomIn}
              disabled={!highlightRegion || highlightRegion === "none"}
            />
          </label>

          {error && (
            <p className="rounded-lg border border-destructive/41 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </p>
          )}
        </aside>

        <main
          ref={chartRef}
          className="flex min-h-105 min-w-0 flex-1 flex-col border border-(--color-rule) bg-(--color-paper-3) overflow-hidden"
        >
          <div className="flex items-center gap-2 border-b border-(--color-rule) px-4 py-2 font-code text-xs text-(--color-muted)">
            <span className="text-(--color-accent)">$</span>
            <span>graph</span>

            <span className="ml-auto flex items-center gap-2">
              {pending && (
                <>
                  <span
                    className="size-1.5 bg-(--color-accent) animate-blink"
                    aria-hidden
                  />

                  <span>{t("common.loading")}</span>
                </>
              )}

              <button
                onClick={toggle}
                className="cursor-pointer p-2 bg-(--color-bg1) hover:bg-(--color-bg2) duration-300 transition-colors"
              >
                {isFullscreen ? <Minimize /> : <Maximize />}
              </button>
            </span>
          </div>

          <div className="relative min-h-0 flex-1 p-4">
            <Chart
              data={data}
              series={series}
              targetName={targetName}
              zoomInHighlight={zoomIn}
              yTitle={t("compare.yRaw")}
              highlightRegions={highlightRegion}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <span className="font-code text-xs uppercase tracking-[0.2em] text-(--color-muted)">
        {label}
      </span>
      {children}
    </div>
  );
}
