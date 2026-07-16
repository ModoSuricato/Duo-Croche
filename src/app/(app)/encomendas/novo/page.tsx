import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Button, LinkButton } from "@/components/ui/button";
import { ItensForm } from "@/components/encomendas/itens-form";
import { getClientes } from "@/lib/data/clientes";
import { getVendedores } from "@/lib/data/vendedores";
import { getProdutos } from "@/lib/data/produtos";
import { createEncomendaAction } from "@/lib/actions/encomendas";
import { todayISO } from "@/lib/format";

export default async function NovaEncomendaPage() {
  const [clientes, vendedores, produtos] = await Promise.all([
    getClientes(),
    getVendedores(),
    getProdutos(),
  ]);

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Nova encomenda" subtitle="Registre um novo pedido" />

      <Card>
        <form action={createEncomendaAction} className="flex flex-col gap-4 p-6">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Cliente" htmlFor="cliente_id">
              <Select id="cliente_id" name="cliente_id" required defaultValue="">
                <option value="" disabled>Selecione um cliente</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </Select>
            </Field>
            <Field label="Vendedor" htmlFor="vendedor_id">
              <Select id="vendedor_id" name="vendedor_id" defaultValue="">
                <option value="">Não informado</option>
                {vendedores.map((v) => (
                  <option key={v.id} value={v.id}>{v.nome}</option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Data do pedido" htmlFor="data_pedido">
              <Input id="data_pedido" name="data_pedido" type="date" defaultValue={todayISO()} required />
            </Field>
            <Field label="Entrega prevista" htmlFor="data_entrega_prevista">
              <Input id="data_entrega_prevista" name="data_entrega_prevista" type="date" />
            </Field>
          </div>

          {produtos.length > 0 ? (
            <ItensForm produtos={produtos} />
          ) : (
            <p className="rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-ink/70">
              Cadastre ao menos um produto antes de criar encomendas.
            </p>
          )}

          <Field label="Observações" htmlFor="observacoes">
            <Textarea id="observacoes" name="observacoes" rows={3} placeholder="Cor, tamanho, detalhes do pedido..." />
          </Field>

          <div className="mt-2 flex justify-end gap-3">
            <LinkButton href="/encomendas" variant="ghost">Cancelar</LinkButton>
            <Button type="submit" disabled={produtos.length === 0}>Salvar encomenda</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
