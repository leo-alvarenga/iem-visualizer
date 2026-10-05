import { useQueries, useQuery } from "@tanstack/react-query";

import { fetchSites, fetchPhoneBook, fetchLocalTargets } from "@/lib/squig";
import { useMemo } from "react";

export function useSquigCatalog() {
  const sitesQuery = useQuery({
    staleTime: 5 * 60_000,
    queryKey: ["squig-sites"],
    queryFn: ({ signal }) => fetchSites(signal),
  });

  const phonebookQueries = useQueries({
    queries: (sitesQuery.data ?? []).flatMap((site) =>
      site.dbs.map((db) => ({
        staleTime: 5 * 60_000,
        queryKey: ["phonebook", site.username, db.folder],
        queryFn: ({ signal }) => fetchPhoneBook(site, db, signal),
      })),
    ),
  });

  const targetsQuery = useQuery({
    staleTime: Infinity,
    queryKey: ["local-targets"],
    queryFn: ({ signal }) => fetchLocalTargets(signal),
  });

  const entries = useMemo(
    () => phonebookQueries.flatMap((q) => q.data?.entries ?? []),
    [phonebookQueries],
  );

  const targets = useMemo(
    () => targetsQuery.data ?? [],
    [targetsQuery.data],
  );

  const loading =
    sitesQuery.isFetching || phonebookQueries.some((q) => q.isFetching);

  const error = sitesQuery.isError ? String(sitesQuery.error) : null;

  return { entries, targets, loading, error };
}
