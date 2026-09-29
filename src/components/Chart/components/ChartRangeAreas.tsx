import { useTranslation } from "react-i18next";
import { ReferenceArea } from "recharts";

import { FREQ_RANGES } from "@/lib/constants";
import { IEM_COLORS } from "@/lib/palette";
import type { RangeCategory } from "@/types";

interface ChartRangeAreasProps {
  highlightRegions?: string | RangeCategory;
}

export function ChartRangeAreas({ highlightRegions }: ChartRangeAreasProps) {
  const { t } = useTranslation();

  return (
    <>
      {FREQ_RANGES.map((r) => {
        const isHighlighted =
          highlightRegions === r.category || highlightRegions === r.id;

        const color = IEM_COLORS[FREQ_RANGES.indexOf(r) % IEM_COLORS.length];

        return (
          <ReferenceArea
            key={r.id}
            x1={r.x1}
            x2={r.x2}
            fill={color}
            stroke={color}
            fillOpacity={isHighlighted ? 0.2 : 0.05}
            strokeOpacity={isHighlighted ? 0.5 : 0.2}
            className="animated-overlay"
            label={
              isHighlighted
                ? {
                    position: "insideTop",
                    fill: "var(--color-muted)",
                    value: t(`ranges.${r.id}`),
                  }
                : undefined
            }
          />
        );
      })}
    </>
  );
}
