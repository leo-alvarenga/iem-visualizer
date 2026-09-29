import { useTranslation } from "react-i18next";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PhoneEntry, TargetEntry } from "@/types";

import { DeviceMeta } from "./DeviceMeta";
import { cn } from "@/lib/utils";

export type LibraryDetailPanelProps = {
  entry: PhoneEntry;
  targets: TargetEntry[];
  hasError?: boolean;
  selectedTarget: TargetEntry | null;
  onSelectTarget: (id: string) => void;
};

export function LibraryDetailPanel(props: LibraryDetailPanelProps) {
  const { entry, targets, selectedTarget, onSelectTarget, hasError } = props;
  const { t } = useTranslation();

  return (
    <aside className="flex shrink-0 flex-col gap-4 lg:w-72">
      <div className="surface flex flex-col gap-3 p-4">
        <span
          className={cn(
            "font-code text-lg font-bold ",
            hasError ? "text-destructive" : "text-(--color-ink)",
          )}
        >
          {entry.brand} {entry.name}
        </span>

        {entry.price && <DeviceMeta label="Price" value={entry.price} />}

        {entry.reviewScore && (
          <DeviceMeta label="Score" value={entry.reviewScore} />
        )}

        <DeviceMeta label="Reviewer" value={entry.reviewerName} />

        <div className="mt-1 flex flex-wrap gap-3">
          {entry.reviewLink && (
            <a
              href={entry.reviewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="font-code text-xs text-(--color-accent) hover:underline"
            >
              {t("library.reviewLink")}
            </a>
          )}

          {entry.shopLink && (
            <a
              href={entry.shopLink}
              target="_blank"
              rel="noopener noreferrer"
              className="font-code text-xs text-(--color-accent) hover:underline"
            >
              {t("library.shopLink")}
            </a>
          )}

          <a
            href={`/?iem=${entry.id}`}
            className="font-code text-xs text-(--color-accent) hover:underline"
          >
            {t("detail.openCompare")}
          </a>
        </div>
      </div>

      <div className="surface flex flex-col gap-3 p-4">
        <div className="space-y-1.5">
          <span className="font-code text-xs uppercase tracking-[0.2em] text-(--color-muted)">
            {t("compare.targetLabel")}
          </span>

          <Select
            value={selectedTarget?.id ?? ""}
            onValueChange={onSelectTarget}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("compare.targetLabel")} />
            </SelectTrigger>

            <SelectContent>
              {targets.map((tgt) => (
                <SelectItem key={tgt.id} value={tgt.id}>
                  {tgt.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </aside>
  );
}
