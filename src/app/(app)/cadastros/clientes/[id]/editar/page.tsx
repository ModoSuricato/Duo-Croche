import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Button, LinkButton } from "@/components/ui/button";
import { getCliente } from "@/lib/data/clientes";
import { updateClienteAction } from "@/lib/actions/clientes";

export default async function EditarClientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cliente = await getCliente(id);
  if (!cliente) notFound();

  const updateWithId = updateClienteAction.bind(null, id);

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Editar cliente" subtitle={cliente.nome} />

      <Card>
        <form action={updateWithId} className="flex flex-col gap-4 p-6">
          <Field label="Nome" htmlFor="nome">
            <Input id="nome" name="nome" required defaultValue={cliente.nome} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Telefone" htmlFor="telefone">
              <Input id="telefone" name="telefone" defaultValue={cliente.telefone ?? ""} />
            </Field>
            <Field label="E-mail" htmlFor="email">
              <Input id="email" name="email" type="email" defaultValue={cliente.email ?? ""} />
            </Field>
          </div>
          <Field label="Endereço" htmlFor="endereco">
            <Input id="endereco" name="endereco" defaultValue={cliente.endereco ?? ""} />
          </Field>
          <Field label="Observações" htmlFor="observacoes">
            <Textarea id="observacoes" name="observacoes" rows={3} defaultValue={cliente.observacoes ?? ""} />
          </Field>
          <div className="mt-2 flex justify-end gap-3">
            <LinkButton href="/cadastros/clientes" variant="ghost">Cancelar</LinkButton>
            <Button type="submit">Salvar alterações</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
