import { clsx } from "clsx";
import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

const variants = {
  primary:
    "bg-terracotta text-white shadow-md shadow-terracotta/25 hover:brightness-105",
  secondary:
    "bg-transparent border border-terracotta/40 text-terracotta-dark hover:bg-terracotta/10",
  ghost: "bg-transparent text-ink/70 hover:bg-ink/5",
  danger: "bg-transparent border border-rose/40 text-rose hover:bg-rose/10",
};

type Variant = keyof typeof variants;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

export function LinkButton({
  href,
  variant = "primary",
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition",
        variants[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}
