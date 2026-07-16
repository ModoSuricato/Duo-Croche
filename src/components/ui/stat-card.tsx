import { clsx } from "clsx";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "terracotta",
  hint,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "terracotta" | "sage" | "rose" | "gold";
  hint?: string;
}) {
  const toneStyles = {
    terracotta: "bg-terracotta/12 text-terracotta-dark",
    sage: "bg-sage/12 text-sage-dark",
    rose: "bg-rose/12 text-rose",
    gold: "bg-gold/15 text-[#8a6417]",
  };

  return (
    <div className="rounded-2xl border border-thread/30 bg-card p-5 shadow-sm shadow-black/[0.03]">
      <div className="flex items-center gap-3">
        <div className={clsx("flex h-10 w-10 items-center justify-center rounded-xl", toneStyles[tone])}>
          <Icon size={20} strokeWidth={2} />
        </div>
        <span className="text-sm font-medium text-ink/60">{label}</span>
      </div>
      <p className="mt-3 font-serif text-2xl text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink/45">{hint}</p>}
    </div>
  );
}
