import { useQueries, useQuery } from "@tanstack/react-query";

import { fetchSites, fetchPhoneBook } from "@/lib/squig";
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

  const entries = useMemo(
    () => phonebookQueries.flatMap((q) => q.data?.entries ?? []),
    [phonebookQueries],
  );

  const targets = useMemo(
    () => [
      ...new Map(
        phonebookQueries
          .flatMap((q) => q.data?.targets ?? [])
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((t) => {
            return [t.id, { ...t, name: `${t.name} (${t.id})` }];
          }),
      ).values(),
    ],
    [phonebookQueries],
  );

  const loading =
    sitesQuery.isFetching || phonebookQueries.some((q) => q.isFetching);

  const error = sitesQuery.isError ? String(sitesQuery.error) : null;

  return { entries, targets, loading, error };
}
