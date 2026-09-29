import { useState } from "react";

export function useActiveSeries() {
  const [active, setActive] = useState<string | null>(null);

  return {
    active,
    enter: (key: string) => setActive(key),
    leave: () => setActive(null),
    toggle: (key: string) => setActive((curr) => (curr === key ? null : key)),
  };
}
