import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageState({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-1 items-center justify-center text-sm text-(--color-muted)",
        className,
      )}
    >
      {children}
    </div>
  );
}