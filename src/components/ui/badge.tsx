import { clsx } from "clsx";

const tones = {
  neutral: "bg-ink/8 text-ink/70",
  gold: "bg-gold/15 text-[#8a6417]",
  sage: "bg-sage/15 text-sage-dark",
  rose: "bg-rose/15 text-rose",
  terracotta: "bg-terracotta/15 text-terracotta-dark",
};

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: keyof typeof tones;
  children: React.ReactNode;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}
