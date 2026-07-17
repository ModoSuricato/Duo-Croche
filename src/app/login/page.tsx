"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function traduzirErroLogin(mensagem: string) {
  if (mensagem.includes("Email not confirmed")) {
    return "Este e-mail ainda não foi confirmado. Peça para o administrador confirmar o usuário no painel do Supabase (Authentication > Users).";
  }
  if (mensagem.includes("Invalid login credentials")) {
    return "E-mail ou senha incorretos. Confira com um dos sócios.";
  }
  return `Não foi possível entrar (${mensagem}). Confira com um dos sócios.`;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [modo, setModo] = useState<"login" | "recuperar">("login");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (!isSupabaseConfigured) {
      router.push(searchParams.get("redirect") || "/");
      router.refresh();
      return;
    }

    setCarregando(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });
    setCarregando(false);
    if (error) {
      setErro(traduzirErroLogin(error.message));
      return;
    }
    router.push(searchParams.get("redirect") || "/");
    router.refresh();
  }

  async function handleRecuperar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setAviso(null);
    setCarregando(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/confirm?next=/atualizar-senha`,
    });
    setCarregando(false);
    if (error) {
      setErro("Não foi possível enviar o link. Confira o e-mail digitado.");
      return;
    }
    setAviso("Se esse e-mail estiver cadastrado, enviamos um link para redefinir a senha. Confira também a caixa de spam.");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--linen)] px-4">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,var(--thread)_1.5px,transparent_1.5px)] [background-size:22px_22px]" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--terracotta)] shadow-lg shadow-[var(--terracotta)]/30">
            <YarnIcon />
          </div>
          <h1 className="font-serif text-3xl text-[var(--ink)]">DuoCrochê</h1>
          <p className="mt-1 text-sm text-[var(--ink)]/60">
            Controle de receitas, custos e encomendas
          </p>
        </div>

        <form
          onSubmit={modo === "login" ? handleSubmit : handleRecuperar}
          className="rounded-3xl border border-[var(--thread)]/30 bg-[var(--card)] p-8 shadow-xl shadow-black/5"
        >
          {!isSupabaseConfigured && (
            <div className="mb-5 rounded-xl border border-[var(--gold)]/40 bg-[var(--gold)]/10 px-4 py-3 text-xs text-[var(--ink)]/70">
              Modo demonstração: o Supabase ainda não foi configurado. Clique
              em <strong>Entrar</strong> para explorar a aplicação com dados
              de exemplo.
            </div>
          )}

          {modo === "recuperar" && (
            <p className="mb-4 text-sm text-[var(--ink)]/60">
              Informe seu e-mail de acesso. Vamos enviar um link para você
              criar uma nova senha.
            </p>
          )}

          <label className="mb-4 block">
            <span className="mb-1.5 block text-sm font-medium text-[var(--ink)]/80">
              E-mail
            </span>
            <input
              type="email"
              required={isSupabaseConfigured}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@duocroche.com"
              className="w-full rounded-xl border border-[var(--thread)]/40 bg-white/60 px-4 py-2.5 text-sm outline-none ring-[var(--terracotta)]/30 transition focus:ring-2"
            />
          </label>

          {modo === "login" && (
            <label className="mb-2 block">
              <span className="mb-1.5 block text-sm font-medium text-[var(--ink)]/80">
                Senha
              </span>
              <input
                type="password"
                required={isSupabaseConfigured}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-[var(--thread)]/40 bg-white/60 px-4 py-2.5 text-sm outline-none ring-[var(--terracotta)]/30 transition focus:ring-2"
              />
            </label>
          )}

          {modo === "login" && isSupabaseConfigured && (
            <button
              type="button"
              onClick={() => {
                setModo("recuperar");
                setErro(null);
                setAviso(null);
              }}
              className="mb-2 text-xs font-medium text-[var(--terracotta-dark)] hover:underline"
            >
              Esqueci minha senha
            </button>
          )}

          {erro && <p className="mb-4 text-sm text-red-600">{erro}</p>}
          {aviso && <p className="mb-4 text-sm text-[var(--sage-dark)]">{aviso}</p>}

          <button
            type="submit"
            disabled={carregando}
            className="mt-4 w-full rounded-xl bg-[var(--terracotta)] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-[var(--terracotta)]/30 transition hover:brightness-105 disabled:opacity-60"
          >
            {carregando
              ? "Enviando..."
              : modo === "recuperar"
                ? "Enviar link de redefinição"
                : isSupabaseConfigured
                  ? "Entrar"
                  : "Entrar (demonstração)"}
          </button>

          {modo === "recuperar" && (
            <button
              type="button"
              onClick={() => {
                setModo("login");
                setErro(null);
                setAviso(null);
              }}
              className="mt-3 w-full text-center text-xs font-medium text-[var(--ink)]/50 hover:underline"
            >
              Voltar para o login
            </button>
          )}
        </form>

        <p className="mt-6 text-center text-xs text-[var(--ink)]/50">
          Acesso restrito aos sócios e vendedores da DuoCrochê
        </p>
      </div>
    </div>
  );
}

function YarnIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6">
      <circle cx="12" cy="12" r="8" />
      <path d="M6 8c3 2 3 6 0 8M9 5c4 3 4 11 0 14M15 5c-4 3-4 11 0 14M18 8c-3 2-3 6 0 8" strokeLinecap="round" />
    </svg>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
