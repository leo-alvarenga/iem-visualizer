import { useState } from "react";
import { useSquigStatus } from "@/hooks/useSquigStatus";

export function OfflineModal() {
  const { squigOffline } = useSquigStatus();
  const [retrying, setRetrying] = useState(false);

  if (!squigOffline) return null;

  function retry() {
    setRetrying(true);
    fetch("https://squig.link/squigsites.json?squig")
      .then(() => window.location.reload())
      .catch(() => setRetrying(false));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="surface mx-4 max-w-sm p-6 text-center shadow-xl">
        <h2 className="mb-3 font-code text-lg font-bold text-(--color-ink)">
          squig.link unreachable
        </h2>
        <p className="mb-6 text-sm text-(--color-muted)">
          All measurement data is sourced live from squig.link. Check your
          connection and try again.
        </p>
        <button
          type="button"
          onClick={retry}
          disabled={retrying}
          className="cursor-pointer border border-(--color-accent) px-4 py-2 font-code text-sm text-(--color-accent) transition-colors hover:bg-(--color-accent) hover:text-(--color-bg1) disabled:opacity-50"
        >
          {retrying ? "Retrying…" : "Retry"}
        </button>
      </div>
    </div>
  );
}
