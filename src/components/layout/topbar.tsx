import { LogOut, KeyRound } from "lucide-react";
import Link from "next/link";
import { signOutAction } from "@/lib/actions/auth";
import { MobileNav } from "./sidebar";
import type { Profile } from "@/lib/database.types";

const papelLabel: Record<Profile["papel"], string> = {
  admin: "Administrador(a)",
  socio: "Sócio(a)",
  vendedor: "Vendedor(a)",
};

export function Topbar({ profile }: { profile: Profile | null }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-thread/30 bg-linen/85 px-4 py-3.5 backdrop-blur sm:px-6">
      <MobileNav />
      <div className="hidden sm:block" />

      <div className="flex items-center gap-3">
        {profile && (
          <div className="text-right leading-tight">
            <p className="text-sm font-semibold text-ink">{profile.nome}</p>
            <p className="text-xs text-ink/50">{papelLabel[profile.papel]}</p>
          </div>
        )}
        <Link
          href="/conta"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-thread/40 text-ink/60 transition hover:bg-ink/5 hover:text-ink"
          aria-label="Minha conta"
          title="Minha conta"
        >
          <KeyRound size={16} />
        </Link>
        <form action={signOutAction}>
          <button
            type="submit"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-thread/40 text-ink/60 transition hover:bg-ink/5 hover:text-ink"
            aria-label="Sair"
            title="Sair"
          >
            <LogOut size={16} />
          </button>
        </form>
      </div>
    </header>
  );
}
