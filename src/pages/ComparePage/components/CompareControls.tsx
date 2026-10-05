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

import { CompareField } from "./CompareField";

type CompareControlsProps = {
  highlightRegion: string;
  zoomIn: boolean;
  onRegionChange: (id: string) => void;
  onZoomInChange: (checked: boolean) => void;
};

export function CompareControls({
  zoomIn,
  onRegionChange,
  onZoomInChange,
  highlightRegion,
}: CompareControlsProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
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
