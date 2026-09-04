import type { CSSProperties, ReactNode } from "react";
import { Trans, useTranslation } from "react-i18next";

const LINKS = {
  autoEq: <a className="link" href="https://github.com/jaakkopasanen/AutoEq" />,
  squig: <a className="link" href="https://squig.link" />,
  oratory: <a className="link" href="https://www.reddit.com/user/oratory1990/" />,
  superReview: <a className="link" href="https://www.youtube.com/@superreview" />,
  code: <code className="font-outlier text-xs" />,
};

export function AboutPage() {
  const { t } = useTranslation();

  return (
    <div
      className="reveal mx-auto flex max-w-2xl flex-col gap-10 py-4"
      style={{ "--i": 0 } as CSSProperties}
    >
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">{t("about.title")}</h1>
        <p className="text-(--color-muted)">{t("about.intro")}</p>
      </header>

      <Section title={t("about.dataTitle")}>
        <p>
          <Trans i18nKey="about.dataBody" components={LINKS} />
        </p>
      </Section>

      <Section title={t("about.methodTitle")}>
        <p>{t("about.methodBody1")}</p>
        <p>{t("about.methodBody2")}</p>
      </Section>

      <Section title={t("about.creditsTitle")}>
        <ul className="flex flex-col gap-2 text-sm">
          <li>
            <a className="link" href="https://squig.link">squig.link</a> — {t("about.credits.squig")}
          </li>
          <li>
            <a className="link" href="https://github.com/jaakkopasanen/AutoEq">AutoEq</a> — {t("about.credits.autoEq")}
          </li>
          <li>
            <a className="link" href="https://www.reddit.com/user/oratory1990/">oratory1990</a> — {t("about.credits.oratory")}
          </li>
          <li>
            <a className="link" href="https://www.youtube.com/@superreview">Super Review</a> — {t("about.credits.superReview")}
          </li>
        </ul>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-outlier text-xs uppercase tracking-[0.12em] text-(--color-muted)">
        {title}
      </h2>
      <div className="flex flex-col gap-3 text-sm leading-relaxed text-(--color-ink)/90">
        {children}
      </div>
    </section>
  );
}
