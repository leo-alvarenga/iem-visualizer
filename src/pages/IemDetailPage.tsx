import { useMemo, useState, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Chart, type ChartRow, type SeriesMeta } from "@/components/Chart";
import { PageState } from "@/components/PageState";
import { Switch } from "@/components/ui/switch";
import { useCapabilities } from "@/hooks/useCapabilities";
import { useCurves } from "@/hooks/useCurves";
import { NORMALIZE_HZ } from "@/lib/constants";
import { meanAbsDeviation } from "@/lib/catalog";
import { mergeSeries, normalizeCurve } from "@/lib/normalize";
import { IEM_COLORS, TARGET_COLOR } from "@/lib/palette";

export function IemDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { caps, error } = useCapabilities();
  const [normalize, setNormalize] = useState(true);

  const iem = caps?.iems.find((i) => i.id === id);

  const metas = useMemo(() => {
    if (!caps || !iem) return [];
    const target = caps.targets[0];
    return target ? [iem, target] : [iem];
  }, [caps, iem]);

  const { curves, pending } = useCurves(metas);

  const { series, data, deviation } = useMemo(() => {
    if (!iem) return { series: [] as SeriesMeta[], data: [] as ChartRow[], deviation: null };
    const raw: { meta: SeriesMeta; points: [number, number][] }[] = [];
    const series: SeriesMeta[] = [];

    const d = curves.get(iem.id);
    const target = caps?.targets[0];
    const td = target ? curves.get(target.id) : undefined;

    if (d) {
      const m = { key: "iem", label: iem.name, color: IEM_COLORS[0] };
      series.push(m);
      raw.push({ meta: m, points: normalizeCurve(d, normalize) });
    }

    if (target && td) {
      const m = { key: "target", label: target.name, color: TARGET_COLOR, dashed: true };
      series.push(m);
      raw.push({ meta: m, points: normalizeCurve(td, normalize) });
    }

    const deviation = d && td ? meanAbsDeviation(d, td) : null;

    return { series, data: mergeSeries(raw), deviation };
  }, [caps, curves, iem, normalize]);

  if (!caps) {
    return (
      <PageState>
        {error ? t("common.loadError", { error }) : t("common.loading")}
      </PageState>
    );
  }

  if (!iem) {
    return (
      <PageState className="flex-col gap-3">
        <p>{t("detail.notFound")}</p>
        <Link to="/library" className="text-(--color-accent)">
          {t("detail.backToLibrary")}
        </Link>
      </PageState>
    );
  }

  return (
    <div className="reveal flex flex-1 flex-col gap-6" style={{ "--i": 0 } as CSSProperties}>
      <div className="flex flex-col gap-4">
        <Link
          to="/library"
          className="flex w-fit items-center gap-1.5 text-sm text-(--color-muted) transition-colors hover:text-(--color-ink)"
        >
          <ArrowLeft className="size-4" aria-hidden />
          {t("detail.back")}
        </Link>

        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1">
            <p className="font-outlier text-xs uppercase tracking-[0.12em] text-(--color-accent)">
              {iem.brand}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">{iem.name}</h1>
          </div>
          <Link
            to={`/?iem=${iem.id}`}
            className="w-fit rounded-full border border-[var(--color-rule)] bg-[var(--color-paper-2)] px-4 py-2 text-sm transition-colors hover:border-[var(--color-accent)]"
          >
            {t("detail.openCompare")}
          </Link>
        </header>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
        <main className="surface relative min-h-[420px] min-w-0 flex-1 p-4">
          <Chart
            data={data}
            series={series}
            yTitle={normalize ? t("compare.yNormalized") : t("compare.yRaw")}
          />
          {pending && (
            <span className="absolute right-5 top-5 text-xs text-(--color-muted)">
              {t("common.loading")}
            </span>
          )}
        </main>

        <aside className="flex shrink-0 flex-col gap-4 lg:w-72">
          <div className="surface flex flex-col gap-3 p-4">
            <Meta label={t("detail.brand")} value={iem.brand} />
            <Meta label={t("detail.source")} value={iem.source} />
            <Meta label={t("detail.rig")} value={iem.rig} />
            <Meta label={t("detail.type")} value={iem.form} />
          </div>

          <div className="surface flex flex-col gap-3 p-4">
            <span className="text-xs font-medium uppercase tracking-wide text-(--color-muted)">
              {t("detail.deviation")}
            </span>
            <p className="font-outlier text-3xl tabular text-(--color-ink)">
              {deviation !== null ? `${deviation.toFixed(2)} dB` : "—"}
            </p>
            <p className="text-xs text-(--color-muted)">
              {t("detail.deviationDesc")}
            </p>
          </div>

          <label className="surface flex items-center justify-between gap-3 p-4 text-sm">
            {t("compare.normalize", { hz: NORMALIZE_HZ })}
            <Switch checked={normalize} onCheckedChange={setNormalize} />
          </label>
        </aside>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-xs text-(--color-muted)">{label}</span>
      <span className="text-sm text-(--color-ink)">{value}</span>
    </div>
  );
}
