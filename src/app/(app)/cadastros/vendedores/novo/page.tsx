import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/field";
import { Button, LinkButton } from "@/components/ui/button";
import { createVendedorAction } from "@/lib/actions/vendedores";

export default function NovoVendedorPage() {
  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Novo vendedor" />

      <Card>
        <form action={createVendedorAction} className="flex flex-col gap-4 p-6">
          <Field label="Nome" htmlFor="nome">
            <Input id="nome" name="nome" required />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Telefone" htmlFor="telefone">
              <Input id="telefone" name="telefone" />
            </Field>
            <Field label="E-mail" htmlFor="email">
              <Input id="email" name="email" type="email" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Tipo de comissão" htmlFor="tipo_comissao">
              <Select id="tipo_comissao" name="tipo_comissao" defaultValue="percentual">
                <option value="percentual">Percentual sobre a venda</option>
                <option value="fixo">Valor fixo por venda</option>
                <option value="nenhuma">Sem comissão</option>
              </Select>
            </Field>
            <Field label="Valor da comissão" htmlFor="valor_comissao" hint="% ou R$, conforme o tipo escolhido">
              <Input id="valor_comissao" name="valor_comissao" type="number" step="0.01" min="0" defaultValue={0} />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm text-ink/70">
            <input type="checkbox" name="ativo" defaultChecked className="h-4 w-4 rounded border-thread/50 accent-[var(--terracotta)]" />
            Vendedor ativo
          </label>
          <div className="mt-2 flex justify-end gap-3">
            <LinkButton href="/cadastros/vendedores" variant="ghost">Cancelar</LinkButton>
            <Button type="submit">Salvar vendedor</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
