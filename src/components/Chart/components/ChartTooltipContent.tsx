import { ArrowBigLeft, Target } from "lucide-react";
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
  percent: number | null;
}

export function ChartTooltipContent({
  name,
  stroke,
  value,
  frequency,
  currentFrequency,
  targetName,
  isActiveSeries,
  deviation,
  percent,
}: ChartTooltipContentProps) {
  const isTargetSeries = name === targetName;
  const isDeviationNegative = deviation && deviation < 0;

  return (
    <>
      <span
        className="text-xs inline-flex gap-1 items-center"
        style={{ color: stroke }}
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

      <span className="flex flex-col gap-1 mb-2 pl-2 text-xs text-(--color-muted)">
        <span className="inline-flex items-center gap-1">
          <span>{`${value.toFixed(2)}dB`}</span>

          <span className="opacity-80 italic">
            {frequency !== currentFrequency && ` (at ${frequency}Hz)`}
          </span>
        </span>

        {name !== targetName && deviation && percent && (
          <span>{`${isDeviationNegative ? "" : "+"}${deviation?.toFixed(2) ?? 0}dB`}</span>
        )}
      </span>
    </>
  );
}
