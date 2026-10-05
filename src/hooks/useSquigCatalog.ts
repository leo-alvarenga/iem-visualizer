import { useQueries } from "@tanstack/react-query";

import { fetchSites, fetchPhoneBook } from "@/lib/squig";

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


  const entries = phonebookQueries.flatMap((q) => q.data?.entries ?? []);
  const targets = [
    ...new Map(
      phonebookQueries
        .flatMap((q) => q.data?.targets ?? [])
        .map((t) => [t.file, t]),
    ).values(),
  ];

  const loading =
    sitesQuery.isFetching || phonebookQueries.some((q) => q.isFetching);

  const error = sitesQuery.isError ? String(sitesQuery.error) : null;

  return { entries, targets, loading, error };
}
