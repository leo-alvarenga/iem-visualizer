import { ArrowBigLeft, Target } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { NameType } from "recharts/types/component/DefaultTooltipContent";

interface ChartTooltipContentProps {
  name: NameType;
  stroke?: string;
  value: number;
  frequency: number | null;
  currentFrequency?: number;
  targetName?: string;
  isActiveSeries: boolean;
  deviation: number | null;
  percent: string | number | null;
}

export function ChartTooltipContent({
  name,
  value,
  stroke,
  percent,
  frequency,
  deviation,
  targetName,
  isActiveSeries,
  currentFrequency,
}: ChartTooltipContentProps) {
  const { t } = useTranslation();

  const isTargetSeries = name === targetName;
  const isDeviationNegative = deviation && deviation < 0;

  const hasDeviation = name !== targetName && deviation && percent;

  return (
    <>
      <span
        style={{ color: stroke, fontSize: 10 }}
        className="inline-flex gap-1 items-center"
      >
        {isTargetSeries ? (
          <Target size={12} />
        ) : (
          <span
            className="w-3 h-3 rounded-full block border-3"
            style={{ borderColor: stroke }}
          />
        )}

        <span className={isActiveSeries ? "underline font-bold" : ""}>
          {name}
        </span>

        {isActiveSeries && <ArrowBigLeft size={16} />}
      </span>

      <span
        className="flex flex-col gap-1 mb-2 pl-2 text-(--color-muted)"
        style={{ fontSize: 10 }}
      >
        <span className="inline-flex items-start gap-1">
          <span>{`${value.toFixed(2)}dB`}</span>

          <span className="opacity-80 italic">
            {frequency !== currentFrequency && ` (at ${frequency}Hz)`}
          </span>

          {!isTargetSeries && (
            <span className="text-wrap">
              {hasDeviation
                ? `(${isDeviationNegative ? "" : "+"}${deviation?.toFixed(2) ?? 0}dB / ${percent}%)`
                : t("detail.noDeviation")}
            </span>
          )}
        </span>
      </span>
    </>
  );
}
