import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmForm } from "@/components/ui/confirm-form";
import { getClientes } from "@/lib/data/clientes";
import { deleteClienteAction } from "@/lib/actions/clientes";

export default async function ClientesPage() {
  const clientes = await getClientes();

  return (
    <div>
      <PageHeader
        title="Clientes"
        subtitle={`${clientes.length} cliente(s) cadastrado(s)`}
        action={
          <LinkButton href="/cadastros/clientes/novo">
            <Plus size={16} /> Novo cliente
          </LinkButton>
        }
      />

      <Card>
        {clientes.length === 0 ? (
          <div className="p-4">
            <EmptyState
              title="Nenhum cliente cadastrado"
              action={<LinkButton href="/cadastros/clientes/novo"><Plus size={16} /> Novo cliente</LinkButton>}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-thread/25 text-xs uppercase tracking-wide text-ink/45">
                  <th className="px-6 py-3 font-medium">Nome</th>
                  <th className="px-6 py-3 font-medium">Telefone</th>
                  <th className="px-6 py-3 font-medium">E-mail</th>
                  <th className="px-6 py-3 font-medium">Endereço</th>
                  <th className="px-6 py-3 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((c) => (
                  <tr key={c.id} className="border-b border-thread/15 last:border-0 hover:bg-ink/[0.02]">
                    <td className="px-6 py-3.5 font-medium text-ink">{c.nome}</td>
                    <td className="px-6 py-3.5 text-ink/70">{c.telefone ?? "—"}</td>
                    <td className="px-6 py-3.5 text-ink/70">{c.email ?? "—"}</td>
                    <td className="px-6 py-3.5 text-ink/70">{c.endereco ?? "—"}</td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <LinkButton href={`/cadastros/clientes/${c.id}/editar`} variant="ghost" className="!px-2 !py-2">
                          <Pencil size={15} />
                        </LinkButton>
                        <ConfirmForm action={deleteClienteAction.bind(null, c.id)} confirmText="Excluir este cliente?">
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
