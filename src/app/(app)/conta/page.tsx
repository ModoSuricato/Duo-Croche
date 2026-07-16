"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function MinhaContaPage() {
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setSucesso(null);

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
      setErro("Não foi possível trocar a senha. Tente novamente.");
      return;
    }

    setSenha("");
    setConfirmacao("");
    setSucesso("Senha atualizada com sucesso.");
  }

  return (
    <div className="mx-auto max-w-md">
      <PageHeader title="Minha conta" subtitle="Trocar sua senha de acesso" />

      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
          <Field label="Nova senha" htmlFor="senha">
            <Input
              id="senha"
              type="password"
              required
              minLength={6}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
            />
          </Field>
          <Field label="Confirmar nova senha" htmlFor="confirmacao">
            <Input
              id="confirmacao"
              type="password"
              required
              minLength={6}
              value={confirmacao}
              onChange={(e) => setConfirmacao(e.target.value)}
              placeholder="••••••••"
            />
          </Field>

          {erro && <p className="text-sm text-red-600">{erro}</p>}
          {sucesso && <p className="text-sm text-sage-dark">{sucesso}</p>}

          <div className="mt-2 flex justify-end">
            <Button type="submit" disabled={carregando}>
              {carregando ? "Salvando..." : "Salvar nova senha"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
