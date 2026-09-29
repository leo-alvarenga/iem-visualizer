export function DeviceMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="font-code text-xs text-(--color-muted)">{label}</span>
      <span className="text-sm text-(--color-ink)">{value}</span>
    </div>
  );
}
