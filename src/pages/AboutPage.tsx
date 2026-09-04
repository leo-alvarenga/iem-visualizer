import type { CSSProperties, ReactNode } from "react";
import { Trans, useTranslation } from "react-i18next";

const LINKS = {
  autoEq: <a className="link" href="https://github.com/jaakkopasanen/AutoEq" />,
  squig: <a className="link" href="https://squig.link" />,
  oratory: <a className="link" href="https://www.reddit.com/user/oratory1990/" />,
  superReview: <a className="link" href="https://www.youtube.com/@superreview" />,
  code: <code className="font-code text-xs" />,
};

export function AboutPage() {
  const { t } = useTranslation();

  return (
    <div
      className="reveal mx-auto flex max-w-2xl flex-col gap-10 py-4"
      style={{ "--i": 0 } as CSSProperties}
    >
      <header className="flex flex-col gap-3">
        <span className="font-code text-sm tracking-[0.2em] text-(--color-accent)">
          ~/about
        </span>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {t("about.title")}
        </h1>
        <p className="text-(--color-muted)">{t("about.intro")}</p>
      </header>

      <Section index="01" title={t("about.dataTitle")}>
        <p>
          <Trans i18nKey="about.dataBody" components={LINKS} />
        </p>
      </Section>

      <Section index="02" title={t("about.methodTitle")}>
        <p>{t("about.methodBody1")}</p>
        <p>{t("about.methodBody2")}</p>
      </Section>

      <Section index="03" title={t("about.creditsTitle")}>
        <ul className="flex flex-col gap-2 text-sm">
          <li>
            <a className="link" href="https://squig.link">squig.link</a>: {t("about.credits.squig")}
          </li>
          <li>
            <a className="link" href="https://github.com/jaakkopasanen/AutoEq">AutoEq</a>: {t("about.credits.autoEq")}
          </li>
          <li>
            <a className="link" href="https://www.reddit.com/user/oratory1990/">oratory1990</a>: {t("about.credits.oratory")}
          </li>
          <li>
            <a className="link" href="https://www.youtube.com/@superreview">Super Review</a>: {t("about.credits.superReview")}
          </li>
        </ul>
      </Section>
    </div>
  );
}

function Section({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <span className="font-code text-sm tracking-[0.2em] text-(--color-accent)">
        {index}
        <span className="text-(--color-muted)">_</span>
      </span>
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <div className="flex flex-col gap-3 text-sm leading-relaxed text-(--color-ink)/90">
        {children}
      </div>
    </section>
  );
}