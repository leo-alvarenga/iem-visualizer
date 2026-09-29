import type { SquigSite } from "@/types";

export const SQUIG_ROOT = "https://squig.link";

export function getBaseUrl(site: SquigSite, db: { folder: string }): string {
  const origin =
    site.urlType === "altDomain" && site.altDomain
      ? site.altDomain
      : `https://${site.username}.squig.link`;

  return `${origin}${db.folder}data/`;
}

export function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
