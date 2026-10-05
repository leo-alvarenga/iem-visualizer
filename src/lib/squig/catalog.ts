import type { SquigSite, PhoneEntry, TargetEntry } from "@/types";
import { SQUIG_ROOT, getBaseUrl, getSiteOrigin, slug } from "./urls";
import { QUERY_TIMEOUT } from "../constants";

async function fetchSiteConfig(
  origin: string,
  signal: AbortSignal,
): Promise<{ normHz: number; normDb: number }> {
  try {
    const res = await fetch(`${origin}/config.js`, {
      signal: AbortSignal.any([signal, AbortSignal.timeout(QUERY_TIMEOUT)]),
    });

    if (!res.ok) return { normHz: 500, normDb: 60 };

    const text = await res.text();

    const db = parseInt(text.match(/default_norm_db\s*=\s*(\d+)/)?.[1] ?? "60");
    const hz = parseInt(
      text.match(/default_norm_hz\s*=\s*(\d+)/)?.[1] ?? "500",
    );

    return { normHz: isNaN(hz) ? 500 : hz, normDb: isNaN(db) ? 60 : db };
  } catch {
    return { normHz: 500, normDb: 60 };
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
): Promise<{ entries: PhoneEntry[] }> {
  const baseUrl = getBaseUrl(site, db);

  const [res, normConfig] = await Promise.all([
    fetch(`${baseUrl}phone_book.json`, {
      signal: AbortSignal.any([signal, AbortSignal.timeout(QUERY_TIMEOUT)]),
    }),

    fetchSiteConfig(getSiteOrigin(site), signal),
  ]);

  if (!res.ok) return { entries: [] };

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

  return { entries };
}

export async function fetchLocalTargets(signal: AbortSignal): Promise<TargetEntry[]> {
  const res = await fetch("/targets/index.json", {
    signal: AbortSignal.any([signal, AbortSignal.timeout(QUERY_TIMEOUT)]),
  });
  if (!res.ok) return [];
  const list: { id: string; name: string }[] = await res.json();
  return list.map(({ id, name }) => ({
    id,
    name,
    file: id,
    dataBaseUrl: "/targets/",
  }));
}
