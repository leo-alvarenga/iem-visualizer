import { useEffect, useState } from "react";
import { fetchCapabilities } from "@/lib/api";
import type { Capabilities } from "@/types";

export function useCapabilities() {
  const [caps, setCaps] = useState<Capabilities | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchCapabilities()
      .then((c) => {
        if (!cancelled) setCaps(c);
      })
      .catch((e) => {
        if (!cancelled) setError(String(e));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { caps, error };
}
