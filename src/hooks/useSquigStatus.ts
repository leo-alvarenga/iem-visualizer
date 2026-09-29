import { useEffect, useState } from "react";

export function useSquigStatus() {
  const [squigOffline, setSquigOffline] = useState(false);

  useEffect(() => {
    fetch("https://squig.link/squigsites.json?squig").catch((e) => {
      if (e instanceof TypeError) setSquigOffline(true);
    });
  }, []);

  return { squigOffline };
}
