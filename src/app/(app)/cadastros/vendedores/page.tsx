import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmForm } from "@/components/ui/confirm-form";
import { getVendedores } from "@/lib/data/vendedores";
import { deleteVendedorAction } from "@/lib/actions/vendedores";

function comissaoLabel(tipo: string, valor: number) {
  if (tipo === "percentual") return `${valor}% por venda`;
  if (tipo === "fixo") return `R$ ${valor.toFixed(2)} fixo`;
  return "Sem comissão";
}

export default async function VendedoresPage() {
  const vendedores = await getVendedores();

  return (
    <div>
      <PageHeader
        title="Vendedores"
        subtitle={`${vendedores.length} vendedor(es) cadastrado(s)`}
        action={
          <LinkButton href="/cadastros/vendedores/novo">
            <Plus size={16} /> Novo vendedor
          </LinkButton>
        }
      />

      <Card>
        {vendedores.length === 0 ? (
          <div className="p-4">
            <EmptyState
              title="Nenhum vendedor cadastrado"
              action={<LinkButton href="/cadastros/vendedores/novo"><Plus size={16} /> Novo vendedor</LinkButton>}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-thread/25 text-xs uppercase tracking-wide text-ink/45">
                  <th className="px-6 py-3 font-medium">Nome</th>
                  <th className="px-6 py-3 font-medium">Contato</th>
                  <th className="px-6 py-3 font-medium">Comissão</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {vendedores.map((v) => (
                  <tr key={v.id} className="border-b border-thread/15 last:border-0 hover:bg-ink/[0.02]">
                    <td className="px-6 py-3.5 font-medium text-ink">{v.nome}</td>
                    <td className="px-6 py-3.5 text-ink/70">{v.telefone ?? v.email ?? "—"}</td>
                    <td className="px-6 py-3.5">
                      <Badge tone={v.tipo_comissao === "nenhuma" ? "neutral" : "gold"}>
                        {comissaoLabel(v.tipo_comissao, v.valor_comissao)}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge tone={v.ativo ? "sage" : "neutral"}>{v.ativo ? "Ativo" : "Inativo"}</Badge>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <LinkButton href={`/cadastros/vendedores/${v.id}/editar`} variant="ghost" className="!px-2 !py-2">
                          <Pencil size={15} />
                        </LinkButton>
                        <ConfirmForm action={deleteVendedorAction.bind(null, v.id)} confirmText="Excluir este vendedor?">
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
