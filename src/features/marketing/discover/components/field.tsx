
export function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <label
          htmlFor={htmlFor}
          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          {label}
        </label>
        {hint && (
          <span className="text-[11px] text-muted-foreground/80">{hint}</span>
        )}
      </div>
      {children}
    </div>
  );
}