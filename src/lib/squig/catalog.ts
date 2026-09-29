import type { SquigSite, PhoneEntry } from "@/types";
import { SQUIG_ROOT, getBaseUrl, slug } from "./urls";

export async function fetchSites(): Promise<SquigSite[]> {
  const res = await fetch(`${SQUIG_ROOT}/squigsites.json?squig`);

  return res.json();
}

export async function fetchPhoneBook(
  site: SquigSite,
  db: { type: string; folder: string },
): Promise<PhoneEntry[]> {
  const baseUrl = getBaseUrl(site, db);
  const res = await fetch(`${baseUrl}phone_book.json`);

  if (!res.ok) return [];

  const brands: {
    name: string;
    phones: {
      name: string;
      file: string | string[];
      suffix?: string | string[];
      price?: string;
      shopLink?: string;
      reviewLink?: string;
      reviewScore?: string;
    }[];
  }[] = await res.json();

  const asArray = <T>(v: T | T[]): T[] => (Array.isArray(v) ? v : [v]);

  return brands.flatMap((brand) =>
    brand.phones.flatMap((phone) => {
      const files = asArray(phone.file);
      const suffixes = phone.suffix ? asArray(phone.suffix) : [];

      return files.map((file, i) => {
        // ponytail: empty/absent suffix falls back to the first suffix, else ""
        const suffix = suffixes[i] || suffixes[0] || "";

        return {
          file,
          name: suffix ? `${phone.name} ${suffix}` : phone.name,
          brand: brand.name,
          price: phone.price,
          dataBaseUrl: baseUrl,
          reviewerName: site.name,
          shopLink: phone.shopLink,
          reviewLink: phone.reviewLink,
          reviewScore: phone.reviewScore,
          reviewerUsername: site.username,
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
}
