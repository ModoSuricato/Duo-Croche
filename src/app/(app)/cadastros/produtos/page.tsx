import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmForm } from "@/components/ui/confirm-form";
import { getProdutos } from "@/lib/data/produtos";
import { deleteProdutoAction } from "@/lib/actions/produtos";
import { formatCurrency } from "@/lib/format";

export default async function ProdutosPage() {
  const produtos = await getProdutos();

  return (
    <div>
      <PageHeader
        title="Produtos"
        subtitle="Catálogo de peças produzidas pela DuoCrochê"
        action={
          <LinkButton href="/cadastros/produtos/novo">
            <Plus size={16} /> Novo produto
          </LinkButton>
        }
      />

      <Card>
        {produtos.length === 0 ? (
          <div className="p-4">
            <EmptyState
              title="Nenhum produto cadastrado"
              description="Cadastre os produtos que a DuoCrochê produz e vende."
              action={<LinkButton href="/cadastros/produtos/novo"><Plus size={16} /> Novo produto</LinkButton>}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-thread/25 text-xs uppercase tracking-wide text-ink/45">
                  <th className="px-6 py-3 font-medium">Produto</th>
                  <th className="px-6 py-3 font-medium">Categoria</th>
                  <th className="px-6 py-3 text-right font-medium">Custo</th>
                  <th className="px-6 py-3 text-right font-medium">Preço de venda</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map((p) => (
                  <tr key={p.id} className="border-b border-thread/15 last:border-0 hover:bg-ink/[0.02]">
                    <td className="px-6 py-3.5 font-medium text-ink">{p.nome}</td>
                    <td className="px-6 py-3.5 text-ink/70">{p.categoria ?? "—"}</td>
                    <td className="px-6 py-3.5 text-right text-ink/70">{formatCurrency(Number(p.custo_producao))}</td>
                    <td className="px-6 py-3.5 text-right font-semibold text-sage-dark">{formatCurrency(Number(p.preco_venda))}</td>
                    <td className="px-6 py-3.5">
                      <Badge tone={p.ativo ? "sage" : "neutral"}>{p.ativo ? "Ativo" : "Inativo"}</Badge>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <LinkButton href={`/cadastros/produtos/${p.id}/editar`} variant="ghost" className="!px-2 !py-2">
                          <Pencil size={15} />
                        </LinkButton>
                        <ConfirmForm action={deleteProdutoAction.bind(null, p.id)} confirmText="Excluir este produto?">
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
