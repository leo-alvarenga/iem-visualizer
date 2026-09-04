import { Link, NavLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const LINKS: { to: string; key: string; end?: boolean }[] = [
  { to: "/", key: "nav.compare", end: true },
  { to: "/library", key: "nav.library" },
  { to: "/about", key: "nav.about" },
];

const OTHER_LANG: Record<string, string> = {
  "pt-BR": "EN",
  "en-US": "PT",
};

export function AppLayout() {
  const { t, i18n } = useTranslation();

  const toggleLang = () => {
    const next = i18n.resolvedLanguage === "pt-BR" ? "en-US" : "pt-BR";
    document.documentElement.lang = next === "pt-BR" ? "pt" : "en";
    localStorage.setItem("lang", next);
    void i18n.changeLanguage(next);
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-(--z-sticky) flex justify-center px-4 pt-4">
        <nav
          aria-label={t("nav.primary")}
          className="flex w-full max-w-3xl items-center justify-between rounded-full border border-(--color-rule) bg-(--color-paper-2)/80 px-4 py-2 backdrop-blur-md"
        >
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-semibold tracking-tight"
          >
            <span className="font-outlier text-(--color-accent)" aria-hidden>
              IEM Graph
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {LINKS.map(({ to, key, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    "rounded-full px-3 py-1.5 text-sm transition-colors",
                    isActive
                      ? "bg-(--color-paper-3) text-(--color-ink)"
                      : "text-(--color-muted) hover:text-(--color-ink)",
                  )
                }
              >
                {t(key)}
              </NavLink>
            ))}
            <button
              type="button"
              aria-label={t("nav.lang")}
              onClick={toggleLang}
              className="ml-1 rounded-full border border-(--color-rule) px-2 py-1 font-outlier text-xs text-(--color-muted) transition-colors hover:text-(--color-ink)"
            >
              {OTHER_LANG[i18n.resolvedLanguage ?? "en-US"]}
            </button>
          </div>
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6">
        <Outlet />
      </main>

      <footer className="px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 border-t border-(--color-rule) pt-6">
          <p className="font-outlier text-xs text-(--color-muted)">
            {t("footer.source")}
          </p>
          <p className="max-w-md text-sm text-(--color-muted)">
            {t("footer.tagline")}
          </p>
        </div>
      </footer>
    </div>
  );
}
