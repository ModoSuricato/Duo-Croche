import { notFound } from "next/navigation";
import { Pencil, Trash2, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { ConfirmForm } from "@/components/ui/confirm-form";
import { StatusBadge } from "@/components/encomendas/status-badge";
import { StatusActions } from "@/components/encomendas/status-actions";
import { getEncomenda } from "@/lib/data/encomendas";
import { getReceitas } from "@/lib/data/receitas";
import { getCustos } from "@/lib/data/custos";
import { deleteEncomendaAction } from "@/lib/actions/encomendas";
import { isAtrasada } from "@/lib/dashboard";
import { formatCurrency, formatDate, todayISO } from "@/lib/format";

export default async function EncomendaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [encomenda, receitas, custos] = await Promise.all([
    getEncomenda(id),
    getReceitas(),
    getCustos(),
  ]);

  if (!encomenda) notFound();

  const hoje = todayISO();
  const atrasada = isAtrasada(encomenda, hoje);
  const receitaGerada = receitas.find((r) => r.encomenda_id === id);
  const custoGerado = custos.find((c) => c.encomenda_id === id);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title={encomenda.clientes?.nome ?? "Encomenda"}
        subtitle={`Pedido em ${formatDate(encomenda.data_pedido)}`}
        action={
          <div className="flex items-center gap-3">
            <StatusBadge status={encomenda.status} />
            <div className="flex items-center gap-2">
              <LinkButton href={`/encomendas/${id}/editar`} variant="secondary">
                <Pencil size={15} /> Editar
              </LinkButton>
              <ConfirmForm action={deleteEncomendaAction.bind(null, id)} confirmText="Excluir esta encomenda?">
                <button type="submit" className="rounded-xl border border-rose/40 p-2.5 text-rose transition hover:bg-rose/10">
                  <Trash2 size={16} />
                </button>
              </ConfirmForm>
            </div>
          </div>
        }
      />

      {atrasada && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm font-medium text-rose">
          <AlertTriangle size={16} /> Esta encomenda está com a entrega atrasada.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader title="Status da encomenda" />
          <div className="p-6">
            <StatusActions id={id} statusAtual={encomenda.status} />

            <div className="stitch-divider my-6" />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-ink/45">Vendedor</p>
                <p className="font-medium text-ink">{encomenda.vendedores?.nome ?? "—"}</p>
              </div>
              <div>
                <p className="text-ink/45">Entrega prevista</p>
                <p className="font-medium text-ink">{formatDate(encomenda.data_entrega_prevista)}</p>
              </div>
              <div>
                <p className="text-ink/45">Entrega realizada</p>
                <p className="font-medium text-ink">{formatDate(encomenda.data_entrega_real)}</p>
              </div>
              <div>
                <p className="text-ink/45">Valor total</p>
                <p className="font-semibold text-ink">{formatCurrency(Number(encomenda.valor_total))}</p>
              </div>
            </div>

            {encomenda.observacoes && (
              <div className="mt-4 rounded-xl bg-ink/5 px-4 py-3 text-sm text-ink/70">
                {encomenda.observacoes}
              </div>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Financeiro gerado" />
          <div className="flex flex-col gap-3 p-6 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-ink/60">Receita</span>
              {receitaGerada ? (
                <Badge tone="sage">{formatCurrency(Number(receitaGerada.valor))}</Badge>
              ) : (
                <span className="text-ink/40">Pendente</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink/60">Comissão</span>
              {custoGerado ? (
                <Badge tone="gold">{formatCurrency(Number(custoGerado.valor))}</Badge>
              ) : (
                <span className="text-ink/40">—</span>
              )}
            </div>
            <p className="mt-1 text-xs text-ink/40">
              Gerados automaticamente ao marcar a encomenda como &quot;Entregue&quot;.
            </p>
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="Itens" subtitle={`${encomenda.encomenda_itens?.length ?? 0} produto(s)`} />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-thread/25 text-xs uppercase tracking-wide text-ink/45">
                <th className="px-6 py-3 font-medium">Produto</th>
                <th className="px-6 py-3 font-medium">Qtd.</th>
                <th className="px-6 py-3 text-right font-medium">Preço unit.</th>
                <th className="px-6 py-3 text-right font-medium">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {encomenda.encomenda_itens?.map((item) => (
                <tr key={item.id} className="border-b border-thread/15 last:border-0">
                  <td className="px-6 py-3.5 font-medium text-ink">{item.produtos?.nome ?? "Produto removido"}</td>
                  <td className="px-6 py-3.5 text-ink/70">{item.quantidade}</td>
                  <td className="px-6 py-3.5 text-right text-ink/70">{formatCurrency(Number(item.preco_unitario))}</td>
                  <td className="px-6 py-3.5 text-right font-medium text-ink">
                    {formatCurrency(item.quantidade * Number(item.preco_unitario))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
