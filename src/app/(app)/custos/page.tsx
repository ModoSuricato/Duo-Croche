import { Plus, Pencil, Trash2, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmForm } from "@/components/ui/confirm-form";
import { getCustos } from "@/lib/data/custos";
import { deleteCustoAction } from "@/lib/actions/custos";
import { formatCurrency, formatDate } from "@/lib/format";

const categoriaLabel: Record<string, string> = {
  materia_prima: "Matéria-prima",
  comissao: "Comissão",
  embalagem: "Embalagem",
  marketing: "Marketing",
  operacional: "Operacional",
  outros: "Outros",
};

export default async function CustosPage() {
  const custos = await getCustos();
  const total = custos.reduce((acc, c) => acc + Number(c.valor), 0);

  return (
    <div>
      <PageHeader
        title="Custos"
        subtitle={`Total acumulado: ${formatCurrency(total)}`}
        action={
          <LinkButton href="/custos/novo">
            <Plus size={16} /> Novo custo
          </LinkButton>
        }
      />

      <Card>
        {custos.length === 0 ? (
          <div className="p-4">
            <EmptyState
              title="Nenhum custo registrado"
              description="Cadastre matéria-prima, embalagens, comissões e outras despesas."
              action={
                <LinkButton href="/custos/novo">
                  <Plus size={16} /> Novo custo
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
                  <th className="px-6 py-3 font-medium">Vendedor</th>
                  <th className="px-6 py-3 text-right font-medium">Valor</th>
                  <th className="px-6 py-3 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {custos.map((c) => (
                  <tr key={c.id} className="border-b border-thread/15 last:border-0 hover:bg-ink/[0.02]">
                    <td className="whitespace-nowrap px-6 py-3.5 text-ink/70">{formatDate(c.data)}</td>
                    <td className="px-6 py-3.5 font-medium text-ink">
                      <div className="flex items-center gap-2">
                        {c.descricao}
                        {c.gerado_automaticamente && (
                          <span title="Gerado automaticamente">
                            <Sparkles size={13} className="text-gold" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge tone={c.categoria === "comissao" ? "gold" : "neutral"}>
                        {categoriaLabel[c.categoria]}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5 text-ink/70">{c.vendedores?.nome ?? "—"}</td>
                    <td className="whitespace-nowrap px-6 py-3.5 text-right font-semibold text-rose">
                      {formatCurrency(Number(c.valor))}
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <LinkButton href={`/custos/${c.id}/editar`} variant="ghost" className="!px-2 !py-2">
                          <Pencil size={15} />
                        </LinkButton>
                        <ConfirmForm
                          action={deleteCustoAction.bind(null, c.id)}
                          confirmText="Excluir este custo?"
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
