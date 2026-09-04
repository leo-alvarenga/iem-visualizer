import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface Option {
  id: string;
  name: string;
}

interface MultiSelectProps {
  label: string;
  options: Option[];
  selected: string[];
  onChange: (ids: string[]) => void;
}

export function MultiSelect({
  label,
  options,
  selected,
  onChange,
}: MultiSelectProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const toggle = (id: string) => {
    onChange(
      selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id],
    );
  };

  const summary =
    selected.length === 0
      ? t("multiSelect.none")
      : selected.length === options.length
        ? t("multiSelect.all")
        : t("multiSelect.count", { count: selected.length, total: options.length });

  return (
    <div>
      <span className="font-code text-xs uppercase tracking-[0.2em] text-(--color-muted)">
        {label}
      </span>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            role="combobox"
            variant="outline"
            className="mt-1.5 w-full justify-between"
          >
            <span className="truncate">{summary}</span>
            <ChevronsUpDown className="size-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[--radix-popover-trigger-width] p-1">
          <div className="max-h-64 overflow-auto">
            {options.map((opt) => {
              const isSelected = selected.includes(opt.id);
              return (
                <label
                  key={opt.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm",
                    "hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggle(opt.id)}
                  />
                  <span className="truncate">{opt.name}</span>
                </label>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
