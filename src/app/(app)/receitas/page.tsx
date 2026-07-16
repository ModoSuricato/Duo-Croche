import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmForm } from "@/components/ui/confirm-form";
import { getReceitas } from "@/lib/data/receitas";
import { deleteReceitaAction } from "@/lib/actions/receitas";
import { formatCurrency, formatDate } from "@/lib/format";

const categoriaLabel: Record<string, string> = {
  venda: "Venda avulsa",
  encomenda: "Encomenda",
  outra: "Outra",
};

export default async function ReceitasPage() {
  const receitas = await getReceitas();
  const total = receitas.reduce((acc, r) => acc + Number(r.valor), 0);

  return (
    <div>
      <PageHeader
        title="Receitas"
        subtitle={`Total acumulado: ${formatCurrency(total)}`}
        action={
          <LinkButton href="/receitas/novo">
            <Plus size={16} /> Nova receita
          </LinkButton>
        }
      />

      <Card>
        {receitas.length === 0 ? (
          <div className="p-4">
            <EmptyState
              title="Nenhuma receita registrada"
              description="Cadastre vendas avulsas ou receitas de encomendas entregues."
              action={
                <LinkButton href="/receitas/novo">
                  <Plus size={16} /> Nova receita
                </LinkButton>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-thread/25 text-xs uppercase tracking-wide text-ink/45">
                  <th className="px-6 py-3 font-medium">Data</th>
                  <th className="px-6 py-3 font-medium">Descrição</th>
                  <th className="px-6 py-3 font-medium">Categoria</th>
                  <th className="px-6 py-3 font-medium">Cliente</th>
                  <th className="px-6 py-3 font-medium">Vendedor</th>
                  <th className="px-6 py-3 text-right font-medium">Valor</th>
                  <th className="px-6 py-3 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {receitas.map((r) => (
                  <tr key={r.id} className="border-b border-thread/15 last:border-0 hover:bg-ink/[0.02]">
                    <td className="whitespace-nowrap px-6 py-3.5 text-ink/70">{formatDate(r.data)}</td>
                    <td className="px-6 py-3.5 font-medium text-ink">{r.descricao}</td>
                    <td className="px-6 py-3.5">
                      <Badge tone={r.categoria === "encomenda" ? "terracotta" : "neutral"}>
                        {categoriaLabel[r.categoria]}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5 text-ink/70">{r.clientes?.nome ?? "—"}</td>
                    <td className="px-6 py-3.5 text-ink/70">{r.vendedores?.nome ?? "—"}</td>
                    <td className="whitespace-nowrap px-6 py-3.5 text-right font-semibold text-sage-dark">
                      {formatCurrency(Number(r.valor))}
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <LinkButton href={`/receitas/${r.id}/editar`} variant="ghost" className="!px-2 !py-2">
                          <Pencil size={15} />
                        </LinkButton>
                        <ConfirmForm
                          action={deleteReceitaAction.bind(null, r.id)}
                          confirmText="Excluir esta receita?"
                        >
                          <button className="rounded-xl px-2 py-2 text-rose transition hover:bg-rose/10" type="submit">
                            <Trash2 size={15} />
                          </button>
                        </ConfirmForm>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
