import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmForm } from "@/components/ui/confirm-form";
import { getSocios } from "@/lib/data/socios";
import { deleteSocioAction } from "@/lib/actions/socios";

export default async function SociosPage() {
  const socios = await getSocios();

  return (
    <div>
      <PageHeader
        title="Sócios"
        subtitle={`${socios.length} sócio(s) cadastrado(s)`}
        action={
          <LinkButton href="/cadastros/socios/novo">
            <Plus size={16} /> Novo sócio
          </LinkButton>
        }
      />

      <Card>
        {socios.length === 0 ? (
          <div className="p-4">
            <EmptyState
              title="Nenhum sócio cadastrado"
              action={<LinkButton href="/cadastros/socios/novo"><Plus size={16} /> Novo sócio</LinkButton>}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-thread/25 text-xs uppercase tracking-wide text-ink/45">
                  <th className="px-6 py-3 font-medium">Nome</th>
                  <th className="px-6 py-3 font-medium">Contato</th>
                  <th className="px-6 py-3 font-medium">Participação</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {socios.map((s) => (
                  <tr key={s.id} className="border-b border-thread/15 last:border-0 hover:bg-ink/[0.02]">
                    <td className="px-6 py-3.5 font-medium text-ink">{s.nome}</td>
                    <td className="px-6 py-3.5 text-ink/70">{s.telefone ?? s.email ?? "—"}</td>
                    <td className="px-6 py-3.5 text-ink/70">
                      {s.percentual_participacao != null ? `${s.percentual_participacao}%` : "—"}
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge tone={s.ativo ? "sage" : "neutral"}>{s.ativo ? "Ativo" : "Inativo"}</Badge>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <LinkButton href={`/cadastros/socios/${s.id}/editar`} variant="ghost" className="!px-2 !py-2">
                          <Pencil size={15} />
                        </LinkButton>
                        <ConfirmForm action={deleteSocioAction.bind(null, s.id)} confirmText="Excluir este sócio?">
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
