import type { CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import { Chart } from "@/components/Chart";
import { useSquigCatalog } from "@/hooks/useSquigCatalog";
import { cn } from "@/lib/utils";

import { LibraryDetailPanel, LibrarySearch } from "./components";
import { useLibraryChart } from "./hooks";
import { ICONS_BY_CHANNEL } from "@/lib/constants";

export function LibraryPage() {
  const { t } = useTranslation();
  const { entries, targets: allTargets, loading } = useSquigCatalog();
  const [searchParams] = useSearchParams();

  const deviceId = searchParams.get("device");

  const {
    data,
    series,
    targets,
    errorIds,
    iemResult,
    iemPending,
    selectedEntry,
    selectedTarget,
    setSelectedTargetId,
    showTarget,
    setShowTarget,
  } = useLibraryChart({ entries, targets: allTargets, deviceId });

  return (
    <div
      style={{ "--i": 0 } as CSSProperties}
      className={cn(
        "reveal flex flex-1 flex-col gap-6 transition-all",
        !deviceId && "items-center justify-center",
      )}
    >
      <header className={cn("flex flex-col gap-2", !deviceId && "text-center")}>
        <span className="font-code text-sm tracking-[0.2em] text-(--color-accent)">
          ~/library
        </span>

        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {t("library.title")}
        </h1>
      </header>

      <LibrarySearch entries={entries} loading={loading} />

      {selectedEntry && (
        <div className="flex w-full min-h-0 flex-col gap-4 lg:flex-row">
          <main className="flex min-h-96 min-w-0 flex-1 flex-col overflow-hidden border border-(--color-rule) bg-(--color-paper-3)">
            <div className="flex items-center gap-2 border-b border-(--color-rule) px-4 py-2 font-code text-xs text-(--color-muted)">
              <span className="text-(--color-accent)">$</span>
              <span>graph</span>

              {iemResult && (
                <span
                  className={cn(
                    "ml-1 rounded border border-(--color-rule) inline-flex gap-2 items-center justify-center font-bold bg-accent py-1/2 px-1",
                    selectedEntry && errorIds.has(selectedEntry.id)
                      ? "text-destructive"
                      : "",
                  )}
                >
                  {`${iemResult.channel} `}
                  {ICONS_BY_CHANNEL[iemResult.channel]}
                </span>
              )}

              {iemPending && (
                <span className="ml-auto flex items-center gap-2">
                  <span
                    className="size-1.5 animate-blink bg-(--color-accent)"
                    aria-hidden
                  />
                  <span>{t("common.loading")}</span>
                </span>
              )}
            </div>

            <div className="min-h-0 flex-1 p-4">
              <Chart
                data={data}
                series={series}
                xTitle={t("compare.xRaw")}
                yTitle={t("compare.yRaw")}
                targetName={selectedTarget?.name}
              />
            </div>
          </main>

          <LibraryDetailPanel
            targets={targets}
            entry={selectedEntry}
            selectedTarget={selectedTarget}
            onSelectTarget={setSelectedTargetId}
            showTarget={showTarget}
            onToggleTarget={setShowTarget}
            hasError={errorIds.has(selectedEntry.id)}
          />
        </div>
      )}
    </div>
  );
}
