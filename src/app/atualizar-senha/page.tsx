"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AtualizarSenhaPage() {
  const router = useRouter();
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (senha.length < 6) {
      setErro("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (senha !== confirmacao) {
      setErro("As senhas não coincidem.");
      return;
    }

    setCarregando(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: senha });
    setCarregando(false);

    if (error) {
      setErro("Não foi possível atualizar a senha. Peça um novo link e tente de novo.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--linen)] px-4">
      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-2xl text-[var(--ink)]">Criar nova senha</h1>
          <p className="mt-1 text-sm text-[var(--ink)]/60">
            Escolha uma nova senha para acessar a DuoCrochê
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-[var(--thread)]/30 bg-[var(--card)] p-8 shadow-xl shadow-black/5"
        >
          <label className="mb-4 block">
            <span className="mb-1.5 block text-sm font-medium text-[var(--ink)]/80">
              Nova senha
            </span>
            <input
              type="password"
              required
              minLength={6}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-[var(--thread)]/40 bg-white/60 px-4 py-2.5 text-sm outline-none ring-[var(--terracotta)]/30 transition focus:ring-2"
            />
          </label>

          <label className="mb-2 block">
            <span className="mb-1.5 block text-sm font-medium text-[var(--ink)]/80">
              Confirmar nova senha
            </span>
            <input
              type="password"
              required
              minLength={6}
              value={confirmacao}
              onChange={(e) => setConfirmacao(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-[var(--thread)]/40 bg-white/60 px-4 py-2.5 text-sm outline-none ring-[var(--terracotta)]/30 transition focus:ring-2"
            />
          </label>

          {erro && <p className="mb-4 text-sm text-red-600">{erro}</p>}

          <button
            type="submit"
            disabled={carregando}
            className="mt-4 w-full rounded-xl bg-[var(--terracotta)] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-[var(--terracotta)]/30 transition hover:brightness-105 disabled:opacity-60"
          >
            {carregando ? "Salvando..." : "Salvar nova senha"}
          </button>
        </form>
      </div>
    </div>
  );
}
