export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-thread/50 px-6 py-14 text-center">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--thread)" strokeWidth="1.6" className="mb-4">
        <circle cx="12" cy="12" r="8" />
        <path d="M6 8c3 2 3 6 0 8M9 5c4 3 4 11 0 14M15 5c-4 3-4 11 0 14M18 8c-3 2-3 6 0 8" strokeLinecap="round" />
      </svg>
      <h3 className="font-serif text-lg text-ink">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-ink/55">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
