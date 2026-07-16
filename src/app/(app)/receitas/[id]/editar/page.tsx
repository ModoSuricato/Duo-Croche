import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/field";
import { Button, LinkButton } from "@/components/ui/button";
import { getClientes } from "@/lib/data/clientes";
import { getVendedores } from "@/lib/data/vendedores";
import { getReceita } from "@/lib/data/receitas";
import { updateReceitaAction } from "@/lib/actions/receitas";

export default async function EditarReceitaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [receita, clientes, vendedores] = await Promise.all([
    getReceita(id),
    getClientes(),
    getVendedores(),
  ]);

  if (!receita) notFound();

  const updateWithId = updateReceitaAction.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Editar receita" subtitle={receita.descricao} />

      <Card>
        <form action={updateWithId} className="flex flex-col gap-4 p-6">
          <Field label="Descrição" htmlFor="descricao">
            <Input id="descricao" name="descricao" required defaultValue={receita.descricao} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Categoria" htmlFor="categoria">
              <Select id="categoria" name="categoria" defaultValue={receita.categoria}>
                <option value="venda">Venda avulsa</option>
                <option value="encomenda">Encomenda</option>
                <option value="outra">Outra</option>
              </Select>
            </Field>
            <Field label="Valor (R$)" htmlFor="valor">
              <Input id="valor" name="valor" type="number" step="0.01" min="0" required defaultValue={receita.valor} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Data" htmlFor="data">
              <Input id="data" name="data" type="date" defaultValue={receita.data.slice(0, 10)} required />
            </Field>
            <Field label="Forma de pagamento" htmlFor="forma_pagamento">
              <Input id="forma_pagamento" name="forma_pagamento" defaultValue={receita.forma_pagamento ?? ""} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Cliente" htmlFor="cliente_id">
              <Select id="cliente_id" name="cliente_id" defaultValue={receita.cliente_id ?? ""}>
                <option value="">Não informado</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </Select>
            </Field>
            <Field label="Vendedor" htmlFor="vendedor_id">
              <Select id="vendedor_id" name="vendedor_id" defaultValue={receita.vendedor_id ?? ""}>
                <option value="">Não informado</option>
                {vendedores.map((v) => (
                  <option key={v.id} value={v.id}>{v.nome}</option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="mt-2 flex justify-end gap-3">
            <LinkButton href="/receitas" variant="ghost">Cancelar</LinkButton>
            <Button type="submit">Salvar alterações</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
