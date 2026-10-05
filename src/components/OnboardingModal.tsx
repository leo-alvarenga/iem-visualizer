import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function OnboardingModal({ open, onClose }: Props) {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div
        className="relative mx-4 max-w-md w-full rounded-xl border border-(--color-rule) bg-(--color-bg1) p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 cursor-pointer text-(--color-muted) transition-colors hover:text-(--color-ink)"
        >
          <X className="w-4 h-4" />
        </button>

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
          onClick={onClose}
          className="w-full cursor-pointer border border-(--color-accent) px-4 py-2 font-code text-sm text-(--color-accent) transition-colors hover:bg-(--color-accent) hover:text-(--color-bg1) mb-4"
        >
          {t("onboarding.dismiss")}
        </button>

        <p className="font-code text-xs text-center text-(--color-muted)">
          Made by{" "}
          <a
            href="https://leoalvarenga.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition-colors hover:text-(--color-ink)"
          >
            Leo Alvarenga
          </a>
        </p>
      </div>
    </div>
  );
}
