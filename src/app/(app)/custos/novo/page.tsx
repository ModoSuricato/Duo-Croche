import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/field";
import { Button, LinkButton } from "@/components/ui/button";
import { getVendedores } from "@/lib/data/vendedores";
import { createCustoAction } from "@/lib/actions/custos";
import { todayISO } from "@/lib/format";

export default async function NovoCustoPage() {
  const vendedores = await getVendedores();

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Novo custo" subtitle="Registre uma despesa da produção" />

      <Card>
        <form action={createCustoAction} className="flex flex-col gap-4 p-6">
          <Field label="Descrição" htmlFor="descricao">
            <Input id="descricao" name="descricao" required placeholder="Ex: Fio de algodão premium" />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Categoria" htmlFor="categoria">
              <Select id="categoria" name="categoria" defaultValue="materia_prima">
                <option value="materia_prima">Matéria-prima</option>
                <option value="embalagem">Embalagem</option>
                <option value="comissao">Comissão</option>
                <option value="marketing">Marketing</option>
                <option value="operacional">Operacional</option>
                <option value="outros">Outros</option>
              </Select>
            </Field>
            <Field label="Valor (R$)" htmlFor="valor">
              <Input id="valor" name="valor" type="number" step="0.01" min="0" required placeholder="0,00" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Data" htmlFor="data">
              <Input id="data" name="data" type="date" defaultValue={todayISO()} required />
            </Field>
            <Field label="Vendedor relacionado" htmlFor="vendedor_id" hint="Opcional, para custos de comissão">
              <Select id="vendedor_id" name="vendedor_id" defaultValue="">
                <option value="">Não informado</option>
                {vendedores.map((v) => (
                  <option key={v.id} value={v.id}>{v.nome}</option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="mt-2 flex justify-end gap-3">
            <LinkButton href="/custos" variant="ghost">Cancelar</LinkButton>
            <Button type="submit">Salvar custo</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
