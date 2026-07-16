import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Button, LinkButton } from "@/components/ui/button";
import { createClienteAction } from "@/lib/actions/clientes";

export default function NovoClientePage() {
  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Novo cliente" />

      <Card>
        <form action={createClienteAction} className="flex flex-col gap-4 p-6">
          <Field label="Nome" htmlFor="nome">
            <Input id="nome" name="nome" required placeholder="Nome completo ou da empresa" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Telefone" htmlFor="telefone">
              <Input id="telefone" name="telefone" placeholder="(00) 00000-0000" />
            </Field>
            <Field label="E-mail" htmlFor="email">
              <Input id="email" name="email" type="email" />
            </Field>
          </div>
          <Field label="Endereço" htmlFor="endereco">
            <Input id="endereco" name="endereco" />
          </Field>
          <Field label="Observações" htmlFor="observacoes">
            <Textarea id="observacoes" name="observacoes" rows={3} placeholder="Preferências, histórico..." />
          </Field>
          <div className="mt-2 flex justify-end gap-3">
            <LinkButton href="/cadastros/clientes" variant="ghost">Cancelar</LinkButton>
            <Button type="submit">Salvar cliente</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
