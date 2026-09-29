import { useEffect, useState } from "react";

import { fetchSites, fetchPhoneBook } from "@/lib/squig";
import { fetchTargets } from "@/lib/catalog";
import type { PhoneEntry, SquigSite, TargetEntry } from "@/types";

export function useSquigCatalog() {
  const [loading, setLoading] = useState(true);

  const [entries, setEntries] = useState<PhoneEntry[]>([]);
  const [targets, setTargets] = useState<TargetEntry[]>([]);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      let sites: SquigSite[];
      try {
        sites = await fetchSites();
      } catch (e) {
        if (!cancelled) {
          setError(String(e));
          setLoading(false);
        }

        return;
      }

      const iemSites = sites.flatMap((site) =>
        site.dbs.map((db) => ({ site, db })),
      );

      // Stream results as phonebooks resolve (incremental loading)
      let pending = iemSites.length + 1;
      const done = () => {
        pending--;

        if (pending === 0 && !cancelled) setLoading(false);
      };

      for (const { site, db } of iemSites) {
        fetchPhoneBook(site, db)
          .then((e) => {
            if (!cancelled) setEntries((prev) => [...prev, ...e]);
          })
          .catch(done)
          .finally(done);
      }

      fetchTargets()
        .then((t) => {
          if (!cancelled) setTargets(t);
        })
        .catch((e) => {
          if (!cancelled) setError(String(e));
          done();
        })
        .finally(done);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { entries, targets, loading, error };
}
