import { useMemo, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Chart, type ChartRow, type SeriesMeta } from "@/components/Chart";
import { PageState } from "@/components/PageState";
import { useCapabilities } from "@/hooks/useCapabilities";
import { useCurves } from "@/hooks/useCurves";
import { meanAbsDeviation } from "@/lib/catalog";
import { mergeSeries, normalizeCurve } from "@/lib/normalize";
import { IEM_COLORS, TARGET_COLOR } from "@/lib/palette";

export function IemDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { caps, error } = useCapabilities();

  const iem = caps?.iems.find((i) => i.id === id);
  const target = caps?.targets[0];

  const metas = useMemo(() => {
    if (!caps || !iem) return [];

    return target ? [iem, target] : [iem];
  }, [caps, iem, target]);

  const { curves, pending } = useCurves(metas);

  const { series, data, deviation } = useMemo(() => {
    if (!iem) {
      return {
        series: [] as SeriesMeta[],
        data: [] as ChartRow[],
        deviation: null,
      };
    }

    const raw: { meta: SeriesMeta; points: [number, number][] }[] = [];
    const series: SeriesMeta[] = [];

    const d = curves.get(iem.id);
    const td = target ? curves.get(target.id) : undefined;

    if (d) {
      const m = { key: "iem", label: iem.name, color: IEM_COLORS[0] };

      series.push(m);
      raw.push({ meta: m, points: normalizeCurve(d, td) });
    }

    if (target && td) {
      const m = {
        key: "target",
        dashed: true,
        label: target.name,
        color: TARGET_COLOR,
      };

      series.push(m);
      raw.push({ meta: m, points: normalizeCurve(td) });
    }

    const deviation = d && td ? meanAbsDeviation(raw[0].points, td) : null;

    return { series, data: mergeSeries(raw), deviation };
  }, [caps, curves, iem, target]);

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
    <div
      className="reveal flex flex-1 flex-col gap-6"
      style={{ "--i": 0 } as CSSProperties}
    >
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
            <span className="font-code text-sm tracking-[0.2em] text-(--color-accent)">
              ~/iem/{iem.id}
            </span>
            <p className="font-code text-xs uppercase tracking-[0.12em] text-(--color-muted)">
              {iem.brand}
            </p>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {iem.name}
            </h1>
          </div>
          <Link
            to={`/?iem=${iem.id}`}
            className="w-fit border border-(--color-rule) px-4 py-2 text-sm transition-colors hover:border-(--color-accent) hover:text-(--color-accent)"
          >
            {t("detail.openCompare")}
          </Link>
        </header>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
        <main className="flex min-h-105 min-w-0 flex-1 flex-col border border-(--color-rule) bg-(--color-paper-3)">
          <div className="flex items-center gap-2 border-b border-(--color-rule) px-4 py-2 font-code text-xs text-(--color-muted)">
            <span className="text-(--color-accent)">$</span>
            <span>graph</span>
            {pending && (
              <span className="ml-auto flex items-center gap-2">
                <span
                  className="size-1.5 bg-(--color-accent) animate-blink"
                  aria-hidden
                />
                <span>{t("common.loading")}</span>
              </span>
            )}
          </div>
          <div className="relative min-h-0 flex-1 p-4">
            <Chart
              data={data}
              series={series}
              targetName={target?.name}
              yTitle={t("compare.yRaw")}
            />
          </div>
        </main>

        <aside className="flex shrink-0 flex-col gap-4 lg:w-72">
          <div className="surface flex flex-col gap-3 p-4">
            <Meta label={t("detail.brand")} value={iem.brand} />
            <Meta label={t("detail.source")} value={iem.source} />
            <Meta label={t("detail.rig")} value={iem.rig} />
            <Meta label={t("detail.type")} value={iem.form} />
          </div>

          <div className="surface flex flex-col gap-3 p-4">
            <span className="font-code text-xs uppercase tracking-[0.2em] text-(--color-muted)">
              {t("detail.deviation")}
            </span>
            <p className="font-code text-3xl tabular text-(--color-ink)">
              {deviation !== null ? `${deviation.toFixed(2)} dB` : "-"}
            </p>

            <p className="text-xs text-(--color-muted)">
              {t("detail.deviationDesc")}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="font-code text-xs text-(--color-muted)">{label}</span>
      <span className="text-sm text-(--color-ink)">{value}</span>
    </div>
  );
}
