import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/field";
import { Button, LinkButton } from "@/components/ui/button";
import { getVendedor } from "@/lib/data/vendedores";
import { updateVendedorAction } from "@/lib/actions/vendedores";

export default async function EditarVendedorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vendedor = await getVendedor(id);
  if (!vendedor) notFound();

  const updateWithId = updateVendedorAction.bind(null, id);

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Editar vendedor" subtitle={vendedor.nome} />

      <Card>
        <form action={updateWithId} className="flex flex-col gap-4 p-6">
          <Field label="Nome" htmlFor="nome">
            <Input id="nome" name="nome" required defaultValue={vendedor.nome} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Telefone" htmlFor="telefone">
              <Input id="telefone" name="telefone" defaultValue={vendedor.telefone ?? ""} />
            </Field>
            <Field label="E-mail" htmlFor="email">
              <Input id="email" name="email" type="email" defaultValue={vendedor.email ?? ""} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Tipo de comissão" htmlFor="tipo_comissao">
              <Select id="tipo_comissao" name="tipo_comissao" defaultValue={vendedor.tipo_comissao}>
                <option value="percentual">Percentual sobre a venda</option>
                <option value="fixo">Valor fixo por venda</option>
                <option value="nenhuma">Sem comissão</option>
              </Select>
            </Field>
            <Field label="Valor da comissão" htmlFor="valor_comissao">
              <Input id="valor_comissao" name="valor_comissao" type="number" step="0.01" min="0" defaultValue={vendedor.valor_comissao} />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm text-ink/70">
            <input type="checkbox" name="ativo" defaultChecked={vendedor.ativo} className="h-4 w-4 rounded border-thread/50 accent-[var(--terracotta)]" />
            Vendedor ativo
          </label>
          <div className="mt-2 flex justify-end gap-3">
            <LinkButton href="/cadastros/vendedores" variant="ghost">Cancelar</LinkButton>
            <Button type="submit">Salvar alterações</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
