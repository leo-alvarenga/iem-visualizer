import type { ReactNode } from "react";

type CompareFieldProps = {
  label: string;
  children: ReactNode;
};

export function CompareField({ label, children }: CompareFieldProps) {
  return (
    <div className="space-y-1.5">
      <span className="font-code text-xs uppercase tracking-[0.2em] text-(--color-muted)">
        {label}
      </span>
      {children}
    </div>
  );
}
