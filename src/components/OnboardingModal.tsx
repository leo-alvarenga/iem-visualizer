import { useState } from "react";
import { useTranslation } from "react-i18next";

const STORAGE_KEY = "onboarding_dismissed";

export function OnboardingModal() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(() => !localStorage.getItem(STORAGE_KEY));

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      onClick={dismiss}
      className="fixed w-screen h-screen z-50 left-0 top-0 flex items-center justify-center bg-black/60"
    >
      <div
        className="surface mx-4 max-w-md p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 font-code text-lg font-bold text-(--color-ink)">
          {t("onboarding.title")}
        </h2>

        <ul className="mb-6 space-y-2 text-sm text-(--color-muted)">
          <li>- {t("onboarding.compare")}</li>
          <li>- {t("onboarding.library")}</li>
          <li>- {t("onboarding.targets")}</li>
          <li>- {t("onboarding.data")}</li>
        </ul>

        <button
          type="button"
          onClick={dismiss}
          className="cursor-pointer border border-(--color-accent) px-4 py-2 font-code text-sm text-(--color-accent) transition-colors hover:bg-(--color-accent) hover:text-(--color-bg1)"
        >
          {t("onboarding.dismiss")}
        </button>
      </div>
    </div>
  );
}
