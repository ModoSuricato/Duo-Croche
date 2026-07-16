import { Plus, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/encomendas/status-badge";
import { getEncomendas } from "@/lib/data/encomendas";
import { isAtrasada } from "@/lib/dashboard";
import { formatCurrency, formatDate, todayISO } from "@/lib/format";
import Link from "next/link";

export default async function EncomendasPage() {
  const encomendas = await getEncomendas();
  const hoje = todayISO();

  return (
    <div>
      <PageHeader
        title="Encomendas"
        subtitle={`${encomendas.length} encomenda(s) registrada(s)`}
        action={
          <LinkButton href="/encomendas/novo">
            <Plus size={16} /> Nova encomenda
          </LinkButton>
        }
      />

      <Card>
        {encomendas.length === 0 ? (
          <div className="p-4">
            <EmptyState
              title="Nenhuma encomenda registrada"
              description="Cadastre encomendas para acompanhar prazos, produção e entrega."
              action={
                <LinkButton href="/encomendas/novo">
                  <Plus size={16} /> Nova encomenda
                </LinkButton>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-thread/25 text-xs uppercase tracking-wide text-ink/45">
                  <th className="px-6 py-3 font-medium">Cliente</th>
                  <th className="px-6 py-3 font-medium">Vendedor</th>
                  <th className="px-6 py-3 font-medium">Pedido</th>
                  <th className="px-6 py-3 font-medium">Entrega prevista</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 text-right font-medium">Valor</th>
                </tr>
              </thead>
              <tbody>
                {encomendas.map((e) => {
                  const atrasada = isAtrasada(e, hoje);
                  return (
                    <tr key={e.id} className="border-b border-thread/15 last:border-0 hover:bg-ink/[0.02]">
                      <td className="px-6 py-3.5">
                        <Link href={`/encomendas/${e.id}`} className="font-medium text-ink hover:text-terracotta-dark">
                          {e.clientes?.nome ?? "Cliente não identificado"}
                        </Link>
                      </td>
                      <td className="px-6 py-3.5 text-ink/70">{e.vendedores?.nome ?? "—"}</td>
                      <td className="whitespace-nowrap px-6 py-3.5 text-ink/70">{formatDate(e.data_pedido)}</td>
                      <td className="whitespace-nowrap px-6 py-3.5">
                        <span className={atrasada ? "flex items-center gap-1.5 font-semibold text-rose" : "text-ink/70"}>
                          {atrasada && <AlertTriangle size={14} />}
                          {formatDate(e.data_entrega_prevista)}
                        </span>
                      </td>
                      <td className="px-6 py-3.5"><StatusBadge status={e.status} /></td>
                      <td className="whitespace-nowrap px-6 py-3.5 text-right font-semibold text-ink">
                        {formatCurrency(Number(e.valor_total))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
