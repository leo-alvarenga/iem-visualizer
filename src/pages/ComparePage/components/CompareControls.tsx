import { useTranslation } from "react-i18next";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FREQ_RANGES } from "@/lib/constants";
import type { TargetEntry } from "@/types";

import { CompareField } from "./CompareField";

type CompareControlsProps = {
  targets: TargetEntry[];
  targetId: string;
  onTargetChange: (id: string) => void;
  highlightRegion: string;
  onRegionChange: (id: string) => void;
  zoomIn: boolean;
  onZoomInChange: (checked: boolean) => void;
};

export function CompareControls({
  targets,
  targetId,
  zoomIn,
  onRegionChange,
  onTargetChange,
  onZoomInChange,
  highlightRegion,
}: CompareControlsProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
      <div className="min-w-44 flex-1">
        <CompareField label={t("compare.targetLabel")}>
          <Select value={targetId} onValueChange={onTargetChange}>
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
        </CompareField>
      </div>

      <div className="min-w-44 flex-1">
        <CompareField label={t("compare.regionLabel")}>
          <Select value={highlightRegion} onValueChange={onRegionChange}>
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
        </CompareField>
      </div>

      <label className="flex items-center justify-between gap-3 pb-2 text-sm">
        {t("compare.zoomInRegionLabel")}

        <Switch
          checked={zoomIn}
          onCheckedChange={onZoomInChange}
          disabled={!highlightRegion || highlightRegion === "none"}
        />
      </label>
    </div>
  );
}
