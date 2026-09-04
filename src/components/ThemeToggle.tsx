import { Palette } from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const THEMES = [
  { id: "catppuccin", name: "Catppuccin Mocha", swatch: ["#1e1e2e", "#cba6f7"] },
  { id: "kanagawa", name: "Kanagawa Wave", swatch: ["#1f1f28", "#957fb8"] },
  { id: "latte", name: "Catppuccin Latte", swatch: ["#eff1f5", "#8839ef"] },
] as const;

export function ThemeToggle() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") ?? "catppuccin",
  );

  const apply = (id: string) => {
    document.documentElement.classList.remove(
      ...THEMES.map((t) => `theme-${t.id}`),
      "dark",
    );
    document.documentElement.classList.add(`theme-${id}`);
    document.documentElement.classList.toggle("dark", id !== "latte");
    localStorage.setItem("theme", id);
    setTheme(id);
  };

  const current = THEMES.find((t) => t.id === theme) ?? THEMES[0];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Change theme"
          className="flex cursor-pointer items-center gap-2 border border-(--color-rule) px-3 py-2 text-(--color-muted) transition-colors duration-250 hover:border-(--color-accent) hover:text-(--color-accent)"
        >
          <Palette className="size-4" aria-hidden />
          <span className="hidden text-sm sm:inline">{current.name}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-1" align="end">
        {THEMES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => apply(t.id)}
            className={`flex w-full cursor-pointer items-center gap-3 px-2 py-1.5 text-sm transition-colors duration-250 ${t.id === theme ? "text-(--color-accent)" : "text-(--color-muted) hover:text-(--color-ink)"}`}
          >
            <span className="flex gap-0.5" aria-hidden>
              {t.swatch.map((c) => (
                <span
                  key={c}
                  className="size-3 border border-(--color-rule)"
                  style={{ backgroundColor: c }}
                />
              ))}
            </span>
            <span className="truncate">{t.name}</span>
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}