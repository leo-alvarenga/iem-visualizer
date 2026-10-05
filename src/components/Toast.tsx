import { useState, useEffect } from "react";
import { X } from "lucide-react";

type ToastItem = { id: number; message: string };

let nextId = 0;
const listeners = new Set<(t: ToastItem) => void>();

export function toast(message: string) {
  const item: ToastItem = { id: ++nextId, message };
  listeners.forEach((fn) => fn(item));
}

export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    const add = (item: ToastItem) => {
      setItems((prev) => [...prev, item]);
      setTimeout(
        () => setItems((prev) => prev.filter((t) => t.id !== item.id)),
        5000,
      );
    };
    listeners.add(add);
    return () => { listeners.delete(add); };
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-2">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-3 rounded-lg border border-(--color-rule) bg-(--color-bg1) px-4 py-3 font-code text-sm shadow-lg"
        >
          <span className="text-(--color-ink)">{item.message}</span>
          <button
            type="button"
            onClick={() => setItems((prev) => prev.filter((t) => t.id !== item.id))}
            className="shrink-0 text-(--color-muted) transition-colors hover:text-(--color-ink)"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
