import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Info } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { OfflineModal } from "@/components/OfflineModal";
import { OnboardingModal } from "@/components/OnboardingModal";
import { Toaster } from "@/components/Toast";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "onboarding_dismissed";

const LINKS: { to: string; key: string; end?: boolean }[] = [
  { to: "/", key: "nav.compare", end: true },
  { to: "/library", key: "nav.library" },
  { to: "/about", key: "nav.about" },
];

const OTHER_LANG: Record<string, string> = {
  "pt-BR": "EN",
  "en-US": "PT",
};

function Brand() {
  return (
    <Link
      to="/"
      aria-label="IEM Graph"
      className="group hidden items-center font-code text-lg tracking-tight md:flex"
    >
      {"IEM Graph".split("").map((ch, i) => (
        <span
          key={i}
          className="transition-all duration-250 group-hover:opacity-60 hover:font-bold hover:-translate-y-1 hover:text-(--color-accent) hover:opacity-100"
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </Link>
  );
}

export function AppLayout() {
  const { t, i18n } = useTranslation();
  const [welcomeOpen, setWelcomeOpen] = useState(
    () => !localStorage.getItem(STORAGE_KEY),
  );

  const closeWelcome = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setWelcomeOpen(false);
  };

  const toggleLang = () => {
    const next = i18n.resolvedLanguage === "pt-BR" ? "en-US" : "pt-BR";

    document.documentElement.lang = next === "pt-BR" ? "pt" : "en";
    localStorage.setItem("lang", next);

    i18n.changeLanguage(next);
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <OfflineModal />
      <OnboardingModal open={welcomeOpen} onClose={closeWelcome} />
      <Toaster />
      <header className="border-b border-(--color-rule)">
        <nav
          aria-label={t("nav.primary")}
          className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-2 sm:px-6"
        >
          <Brand />

          <span className="hidden items-center gap-1 font-code text-sm italic md:inline-flex">
            <span className="text-(--color-muted)">by</span>
            <a
              href="https://leoalvarenga.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-(--color-muted) underline transition-colors duration-250 hover:text-(--color-accent)"
            >
              Leo Alvarenga
            </a>
          </span>
          <span className="ml-auto flex items-center gap-3 sm:gap-6">
            {LINKS.map(({ to, key, end }) => (
              <NavLink
                to={to}
                key={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    "font-code text-sm transition-colors duration-250",
                    isActive
                      ? "text-(--color-accent) underline underline-offset-4"
                      : "text-(--color-ink) hover:text-(--color-accent)",
                  )
                }
              >
                {t(key)}
              </NavLink>
            ))}
          </span>

          <span className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setWelcomeOpen(true)}
              aria-label="About"
              className="cursor-pointer p-1.5 text-(--color-muted) transition-colors duration-250 hover:text-(--color-accent)"
            >
              <Info className="w-4 h-4" />
            </button>
            <ThemeToggle />
            <button
              type="button"
              onClick={toggleLang}
              aria-label={t("nav.lang")}
              className="cursor-pointer border border-(--color-rule) px-3 py-2 font-code text-sm text-(--color-muted) transition-colors duration-250 hover:border-(--color-accent) hover:text-(--color-accent)"
            >
              {OTHER_LANG[i18n.resolvedLanguage ?? "en-US"]}
            </button>
          </span>
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6">
        <Outlet />
      </main>

      <footer className="border-t-2 border-(--color-rule) px-4 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 text-center">
          <p className="font-code text-sm text-(--color-ink)">
            {t("footer.tagline")}
          </p>

          <p className="font-code text-xs text-(--color-muted)">
            {t("footer.source")}
          </p>
        </div>
      </footer>
    </div>
  );
}
