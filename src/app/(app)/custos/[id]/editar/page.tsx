import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/field";
import { Button, LinkButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getVendedores } from "@/lib/data/vendedores";
import { getCusto } from "@/lib/data/custos";
import { updateCustoAction } from "@/lib/actions/custos";

export default async function EditarCustoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [custo, vendedores] = await Promise.all([getCusto(id), getVendedores()]);

  if (!custo) notFound();

  const updateWithId = updateCustoAction.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Editar custo"
        subtitle={custo.descricao}
        action={custo.gerado_automaticamente ? <Badge tone="gold">Gerado automaticamente</Badge> : undefined}
      />

      <Card>
        <form action={updateWithId} className="flex flex-col gap-4 p-6">
          <Field label="Descrição" htmlFor="descricao">
            <Input id="descricao" name="descricao" required defaultValue={custo.descricao} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Categoria" htmlFor="categoria">
              <Select id="categoria" name="categoria" defaultValue={custo.categoria}>
                <option value="materia_prima">Matéria-prima</option>
                <option value="embalagem">Embalagem</option>
                <option value="comissao">Comissão</option>
                <option value="marketing">Marketing</option>
                <option value="operacional">Operacional</option>
                <option value="outros">Outros</option>
              </Select>
            </Field>
            <Field label="Valor (R$)" htmlFor="valor">
              <Input id="valor" name="valor" type="number" step="0.01" min="0" required defaultValue={custo.valor} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Data" htmlFor="data">
              <Input id="data" name="data" type="date" defaultValue={custo.data.slice(0, 10)} required />
            </Field>
            <Field label="Vendedor relacionado" htmlFor="vendedor_id">
              <Select id="vendedor_id" name="vendedor_id" defaultValue={custo.vendedor_id ?? ""}>
                <option value="">Não informado</option>
                {vendedores.map((v) => (
                  <option key={v.id} value={v.id}>{v.nome}</option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="mt-2 flex justify-end gap-3">
            <LinkButton href="/custos" variant="ghost">Cancelar</LinkButton>
            <Button type="submit">Salvar alterações</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
