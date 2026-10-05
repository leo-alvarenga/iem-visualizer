import { QUERY_TIMEOUT } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

export function useSquigStatus() {
  const { isError } = useQuery({
    queryKey: ["squig-sites"],

    queryFn: ({ signal }) =>
      fetch("https://squig.link/squigsites.json?squig", {
        signal: AbortSignal.any([signal, AbortSignal.timeout(QUERY_TIMEOUT)]),
      }).then((r) => {
        if (!r.ok) throw new Error(r.status.toString());

        return r.json();
      }),

    retry: false,
  });

  return { squigOffline: isError };
}
