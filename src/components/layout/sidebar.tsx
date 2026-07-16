"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  PackageSearch,
  Boxes,
  Users,
  ShoppingBag,
  UserRound,
  Handshake,
} from "lucide-react";
import { useState } from "react";

const mainNav = [
  { href: "/", label: "Dashboard Geral", icon: LayoutDashboard },
  { href: "/receitas", label: "Receitas", icon: Wallet },
  { href: "/custos", label: "Custos", icon: Receipt },
  { href: "/encomendas", label: "Encomendas", icon: PackageSearch },
  { href: "/estoque", label: "Estoque", icon: Boxes },
];

const cadastrosNav = [
  { href: "/cadastros/produtos", label: "Produtos", icon: ShoppingBag },
  { href: "/cadastros/clientes", label: "Clientes", icon: Users },
  { href: "/cadastros/vendedores", label: "Vendedores", icon: UserRound },
  { href: "/cadastros/socios", label: "Sócios", icon: Handshake },
];

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  onClick,
}: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={clsx(
        "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition",
        active
          ? "bg-terracotta text-white shadow-md shadow-terracotta/25"
          : "text-ink/65 hover:bg-ink/5 hover:text-ink",
      )}
    >
      <Icon size={18} strokeWidth={2} />
      {label}
    </Link>
  );
}

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <div className="mb-8 flex items-center gap-3 px-1">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-terracotta shadow-md shadow-terracotta/30">
          <YarnIcon />
        </div>
        <div>
          <p className="font-serif text-lg leading-tight text-ink">DuoCrochê</p>
          <p className="text-[11px] uppercase tracking-wide text-ink/45">
            Receitas &amp; Custos
          </p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {mainNav.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            active={pathname === item.href}
            onClick={onNavigate}
          />
        ))}
      </nav>

      <div className="my-5 stitch-divider" />

      <p className="mb-2 px-3.5 text-[11px] font-semibold uppercase tracking-wide text-ink/40">
        Cadastros
      </p>
      <nav className="flex flex-col gap-1">
        {cadastrosNav.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            active={pathname.startsWith(item.href)}
            onClick={onNavigate}
          />
        ))}
      </nav>
    </>
  );
}

function YarnIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.7">
      <circle cx="12" cy="12" r="8" />
      <path
        d="M6 8c3 2 3 6 0 8M9 5c4 3 4 11 0 14M15 5c-4 3-4 11 0 14M18 8c-3 2-3 6 0 8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto border-r border-thread/30 bg-linen-deep/60 px-4 py-6 lg:flex">
      <NavContent />
    </aside>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-thread/40 text-ink"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />
          <div className="relative flex h-full w-72 flex-col overflow-y-auto bg-linen px-4 py-6 shadow-2xl">
            <NavContent onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
