import { useRef, useState } from "react";

export function useSplitResize() {
  const [splitWidth, setSplitWidth] = useState(360);
  const drag = useRef<{ x: number; w: number } | null>(null);

  const startResize = (e: React.PointerEvent<HTMLDivElement>) => {
    drag.current = { x: e.clientX, w: splitWidth };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onResize = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;

    const next = drag.current.w + (e.clientX - drag.current.x);
    setSplitWidth(Math.min(560, Math.max(260, next)));
  };

  const stopResize = (e: React.PointerEvent<HTMLDivElement>) => {
    drag.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return { splitWidth, startResize, onResize, stopResize };
}
