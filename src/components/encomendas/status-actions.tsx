"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateStatusEncomendaAction } from "@/lib/actions/encomendas";
import type { StatusEncomenda } from "@/lib/database.types";
import { clsx } from "clsx";

const fluxo: { status: StatusEncomenda; label: string }[] = [
  { status: "pendente", label: "Pendente" },
  { status: "em_producao", label: "Em produção" },
  { status: "pronto", label: "Pronto" },
  { status: "entregue", label: "Entregue" },
];

export function StatusActions({
  id,
  statusAtual,
}: {
  id: string;
  statusAtual: StatusEncomenda;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function mudarStatus(novo: StatusEncomenda) {
    startTransition(async () => {
      await updateStatusEncomendaAction(id, novo);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {fluxo.map((f) => (
        <button
          key={f.status}
          disabled={isPending || statusAtual === "cancelado"}
          onClick={() => mudarStatus(f.status)}
          className={clsx(
            "rounded-xl px-3.5 py-2 text-xs font-semibold transition disabled:opacity-40",
            statusAtual === f.status
              ? "bg-terracotta text-white shadow-sm"
              : "border border-thread/40 text-ink/60 hover:bg-ink/5",
          )}
        >
          {f.label}
        </button>
      ))}
      {statusAtual !== "cancelado" && statusAtual !== "entregue" && (
        <button
          disabled={isPending}
          onClick={() => mudarStatus("cancelado")}
          className="rounded-xl border border-rose/40 px-3.5 py-2 text-xs font-semibold text-rose transition hover:bg-rose/10 disabled:opacity-40"
        >
          Cancelar encomenda
        </button>
      )}
    </div>
  );
}
