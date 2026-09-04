import { useMemo, useState, type CSSProperties } from "react";
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
import { FREQ_RANGES, NORMALIZE_HZ } from "@/lib/constants";
import { mergeSeries, normalizeCurve } from "@/lib/normalize";
import { IEM_COLORS, TARGET_COLOR } from "@/lib/palette";

function readIds(param: string | null, fallback: string[]): string[] {
  if (param === null) return fallback;
  const ids = param.split(",").filter(Boolean);
  return ids.length ? ids : fallback;
}

export function ComparePage() {
  const { t } = useTranslation();
  const { caps, error } = useCapabilities();
  const [searchParams, setSearchParams] = useSearchParams();

  const [zoomIn, setZoomIn] = useState(false);
  const [normalize, setNormalize] = useState(true);

  const selectedIems = useMemo(
    () => readIds(searchParams.get("iem"), caps ? [caps.iems[0].id] : []),
    [searchParams, caps],
  );

  const targetId = useMemo(
    () => searchParams.get("target") ?? caps?.targets[0]?.id ?? "",
    [searchParams, caps],
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
        raw.push({ meta: m, points: normalizeCurve(d, normalize) });
      });

    caps.targets
      .filter((t) => t.id === targetId)
      .forEach((meta) => {
        const d = curves.get(meta.id);
        if (!d) return;

        const m = {
          color: TARGET_COLOR,
          label: meta.name,
          key: `target:${meta.id}`,
          dashed: true,
        };

        series.push(m);
        raw.push({ meta: m, points: normalizeCurve(d, normalize) });
      });

    return { series, data: mergeSeries(raw) };
  }, [caps, selectedIems, targetId, normalize, curves]);

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
      className="reveal flex flex-1 flex-col gap-6"
      style={{ "--i": 0 } as CSSProperties}
    >
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("compare.title")}
        </h1>
        <p className="max-w-xl text-sm text-(--color-muted)">
          {t("compare.subtitle", { hz: NORMALIZE_HZ })}
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

          <label className="flex items-center justify-between gap-3 text-sm">
            {t("compare.normalize", { hz: NORMALIZE_HZ })}
            <Switch checked={normalize} onCheckedChange={setNormalize} />
          </label>

          {error && (
            <p className="rounded-lg border border-(--color-destructive)/40 bg-(--color-destructive)/10 px-3 py-2 text-xs text-(--color-destructive)">
              {error}
            </p>
          )}
        </aside>

        <main className="surface relative min-h-105 min-w-0 flex-1 p-4">
          <Chart
            data={data}
            series={series}
            zoomInHighlight={zoomIn}
            highlightRegions={highlightRegion}
            yTitle={normalize ? t("compare.yNormalized") : t("compare.yRaw")}
          />

          {pending && (
            <span className="absolute right-5 top-5 text-xs text-(--color-muted)">
              {t("common.loading")}
            </span>
          )}
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
      <span className="text-xs font-medium tracking-wide text-(--color-muted) uppercase">
        {label}
      </span>
      {children}
    </div>
  );
}
