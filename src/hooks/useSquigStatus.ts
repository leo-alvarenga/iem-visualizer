import { useQuery } from "@tanstack/react-query";

export function useSquigStatus() {
  const { isError } = useQuery({
    queryKey: ["squig-sites"],
    queryFn: () =>
      fetch("https://squig.link/squigsites.json?squig").then((r) => {
        if (!r.ok) throw new Error(r.status.toString());
        return r.json();
      }),
    retry: false,
  });

  return { squigOffline: isError };
}
