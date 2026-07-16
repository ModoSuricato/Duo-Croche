import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Button, LinkButton } from "@/components/ui/button";
import { ItensForm } from "@/components/encomendas/itens-form";
import { getClientes } from "@/lib/data/clientes";
import { getVendedores } from "@/lib/data/vendedores";
import { getProdutos } from "@/lib/data/produtos";
import { getEncomenda } from "@/lib/data/encomendas";
import { updateEncomendaAction } from "@/lib/actions/encomendas";

export default async function EditarEncomendaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [encomenda, clientes, vendedores, produtos] = await Promise.all([
    getEncomenda(id),
    getClientes(),
    getVendedores(),
    getProdutos(),
  ]);

  if (!encomenda) notFound();

  const updateWithId = updateEncomendaAction.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Editar encomenda" subtitle={encomenda.clientes?.nome ?? ""} />

      <Card>
        <form action={updateWithId} className="flex flex-col gap-4 p-6">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Cliente" htmlFor="cliente_id">
              <Select id="cliente_id" name="cliente_id" required defaultValue={encomenda.cliente_id ?? ""}>
                <option value="" disabled>Selecione um cliente</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </Select>
            </Field>
            <Field label="Vendedor" htmlFor="vendedor_id">
              <Select id="vendedor_id" name="vendedor_id" defaultValue={encomenda.vendedor_id ?? ""}>
                <option value="">Não informado</option>
                {vendedores.map((v) => (
                  <option key={v.id} value={v.id}>{v.nome}</option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Data do pedido" htmlFor="data_pedido">
              <Input id="data_pedido" name="data_pedido" type="date" defaultValue={encomenda.data_pedido.slice(0, 10)} required />
            </Field>
            <Field label="Entrega prevista" htmlFor="data_entrega_prevista">
              <Input
                id="data_entrega_prevista"
                name="data_entrega_prevista"
                type="date"
                defaultValue={encomenda.data_entrega_prevista?.slice(0, 10) ?? ""}
              />
            </Field>
          </div>

          <ItensForm
            produtos={produtos}
            initialItens={encomenda.encomenda_itens?.map((i) => ({
              produto_id: i.produto_id ?? "",
              quantidade: i.quantidade,
              preco_unitario: Number(i.preco_unitario),
            }))}
          />

          <Field label="Observações" htmlFor="observacoes">
            <Textarea id="observacoes" name="observacoes" rows={3} defaultValue={encomenda.observacoes ?? ""} />
          </Field>

          <div className="mt-2 flex justify-end gap-3">
            <LinkButton href={`/encomendas/${id}`} variant="ghost">Cancelar</LinkButton>
            <Button type="submit">Salvar alterações</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
