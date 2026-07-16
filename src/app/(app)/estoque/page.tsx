import { Save } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { LinkButton } from "@/components/ui/button";
import { getProdutos } from "@/lib/data/produtos";
import { getEstoque } from "@/lib/data/estoque";
import { atualizarEstoqueAction } from "@/lib/actions/estoque";
import { formatCurrency } from "@/lib/format";

export default async function EstoquePage() {
  const [produtos, estoque] = await Promise.all([getProdutos(), getEstoque()]);
  const quantidadePorProduto = new Map(estoque.map((e) => [e.produto_id, e.quantidade]));

  return (
    <div>
      <PageHeader
        title="Estoque"
        subtitle="Quantidade disponível de cada produto"
      />

      <Card>
        {produtos.length === 0 ? (
          <div className="p-4">
            <EmptyState
              title="Nenhum produto cadastrado"
              description="Cadastre produtos para começar a controlar o estoque."
              action={<LinkButton href="/cadastros/produtos/novo">Cadastrar produto</LinkButton>}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-thread/25 text-xs uppercase tracking-wide text-ink/45">
                  <th className="px-6 py-3 font-medium">Produto</th>
                  <th className="px-6 py-3 font-medium">Categoria</th>
                  <th className="px-6 py-3 font-medium">Preço de venda</th>
                  <th className="px-6 py-3 font-medium">Quantidade em estoque</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map((p) => (
                  <tr key={p.id} className="border-b border-thread/15 last:border-0 hover:bg-ink/[0.02]">
                    <td className="px-6 py-3.5 font-medium text-ink">{p.nome}</td>
                    <td className="px-6 py-3.5 text-ink/70">{p.categoria ?? "—"}</td>
                    <td className="px-6 py-3.5 text-ink/70">{formatCurrency(Number(p.preco_venda))}</td>
                    <td className="px-6 py-3.5">
                      <form action={atualizarEstoqueAction} className="flex items-center gap-2">
                        <input type="hidden" name="produto_id" value={p.id} />
                        <input
                          type="number"
                          name="quantidade"
                          min={0}
                          defaultValue={quantidadePorProduto.get(p.id) ?? 0}
                          className="w-24 rounded-lg border border-thread/40 bg-white/70 px-2.5 py-1.5 text-sm outline-none focus:ring-2 focus:ring-terracotta/25"
                        />
                        <button
                          type="submit"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-thread/40 text-ink/60 transition hover:bg-ink/5 hover:text-ink"
                          title="Salvar quantidade"
                        >
                          <Save size={14} />
                        </button>
                      </form>
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
