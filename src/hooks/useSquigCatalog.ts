import { useQuery, useQueries } from "@tanstack/react-query";

import { fetchSites, fetchPhoneBook } from "@/lib/squig";
import { fetchTargets } from "@/lib/catalog";

export function useSquigCatalog() {
  const sitesQuery = useQuery({
    queryKey: ["squig-sites"],
    queryFn: fetchSites,
    staleTime: 5 * 60_000,
  });

  const phonebookQueries = useQueries({
    queries: (sitesQuery.data ?? []).flatMap((site) =>
      site.dbs.map((db) => ({
        queryKey: ["phonebook", site.username, db.folder],
        queryFn: () => fetchPhoneBook(site, db),
        staleTime: 5 * 60_000,
      })),
    ),
  });

  const targetsQuery = useQuery({
    queryKey: ["squig-targets"],
    queryFn: fetchTargets,
    staleTime: 5 * 60_000,
  });

  const entries = phonebookQueries.flatMap((q) => q.data ?? []);
  const targets = targetsQuery.data ?? [];
  const loading =
    sitesQuery.isLoading || phonebookQueries.some((q) => q.isLoading);
  const error = sitesQuery.isError
    ? String(sitesQuery.error)
    : targetsQuery.isError
      ? String(targetsQuery.error)
      : null;

  return { entries, targets, loading, error };
}
