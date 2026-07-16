import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

export function Card({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-thread/30 bg-card shadow-sm shadow-black/[0.03]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-thread/25 px-6 py-4">
      <div>
        <h3 className="font-serif text-lg text-ink">{title}</h3>
        {subtitle && <p className="mt-0.5 text-sm text-ink/55">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
