import type { SquigSite, PhoneEntry, TargetEntry } from "@/types";
import { SQUIG_ROOT, getBaseUrl, getSiteOrigin, slug } from "./urls";
import { QUERY_TIMEOUT } from "../constants";

function parseTargetFiles(text: string): string[] {
  const seen = new Set<string>();
  for (const m of text.matchAll(/files\s*:\s*\[([\s\S]*?)\]/g)) {
    for (const s of m[1].matchAll(/["']([^"']+)["']/g)) seen.add(s[1]);
  }
  return [...seen];
}

async function fetchSiteConfig(
  origin: string,
  signal: AbortSignal,
): Promise<{ normHz: number; normDb: number; targetFiles: string[] }> {
  try {
    const res = await fetch(`${origin}/config.js`, {
      signal: AbortSignal.any([signal, AbortSignal.timeout(QUERY_TIMEOUT)]),
    });

    if (!res.ok) return { normHz: 500, normDb: 60, targetFiles: [] };

    const text = await res.text();

    const db = parseInt(text.match(/default_norm_db\s*=\s*(\d+)/)?.[1] ?? "60");
    const hz = parseInt(
      text.match(/default_norm_hz\s*=\s*(\d+)/)?.[1] ?? "500",
    );

    return { normHz: isNaN(hz) ? 500 : hz, normDb: isNaN(db) ? 60 : db, targetFiles: parseTargetFiles(text) };
  } catch {
    return { normHz: 500, normDb: 60, targetFiles: [] };
  }
}

export async function fetchSites(signal: AbortSignal): Promise<SquigSite[]> {
  const res = await fetch(`${SQUIG_ROOT}/squigsites.json?squig`, {
    signal: AbortSignal.any([signal, AbortSignal.timeout(QUERY_TIMEOUT)]),
  });

  return res.json();
}

export async function fetchPhoneBook(
  site: SquigSite,
  db: { type: string; folder: string },
  signal: AbortSignal,
): Promise<{ entries: PhoneEntry[]; targets: TargetEntry[] }> {
  const baseUrl = getBaseUrl(site, db);

  const [res, normConfig] = await Promise.all([
    fetch(`${baseUrl}phone_book.json`, {
      signal: AbortSignal.any([signal, AbortSignal.timeout(QUERY_TIMEOUT)]),
    }),

    fetchSiteConfig(getSiteOrigin(site), signal),
  ]);

  if (!res.ok) return { entries: [], targets: [] };

  const brands: {
    name: string;
    phones: {
      name: string;
      price?: string;
      shopLink?: string;
      reviewLink?: string;
      reviewScore?: string;
      file: string | string[];
      suffix?: string | string[];
    }[];
  }[] = await res.json();

  const asArray = <T>(v: T | T[]): T[] => (Array.isArray(v) ? v : [v]);

  const entries = brands.flatMap((brand) =>
    brand.phones.flatMap((phone) => {
      const files = asArray(phone.file);
      const suffixes = phone.suffix ? asArray(phone.suffix) : [];

      return files.map((file, i) => {
        const suffix = suffixes[i] || suffixes[0] || "";

        return {
          file,
          brand: brand.name,
          price: phone.price,
          dataBaseUrl: baseUrl,
          reviewerName: site.name,
          shopLink: phone.shopLink,
          normHz: normConfig.normHz,
          normDb: normConfig.normDb,
          reviewLink: phone.reviewLink,
          reviewScore: phone.reviewScore,
          reviewerUsername: site.username,
          name: suffix ? `${phone.name} ${suffix}` : phone.name,

          // single-file keeps its old id so existing ?device= URLs don't break
          id: slug(
            files.length === 1
              ? `${phone.name}--${site.username}`
              : `${file}--${site.username}`,
          ),
        };
      });
    }),
  );

  const targetBase = `${getSiteOrigin(site)}/data/`;
  const targets = normConfig.targetFiles.map((file) => ({
    file,
    name: file,
    id: slug(file),
    dataBaseUrl: targetBase,
  }));

  return { entries, targets };
}
