import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/field";
import { Button, LinkButton } from "@/components/ui/button";
import { getSocio } from "@/lib/data/socios";
import { updateSocioAction } from "@/lib/actions/socios";

export default async function EditarSocioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const socio = await getSocio(id);
  if (!socio) notFound();

  const updateWithId = updateSocioAction.bind(null, id);

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Editar sócio" subtitle={socio.nome} />

      <Card>
        <form action={updateWithId} className="flex flex-col gap-4 p-6">
          <Field label="Nome" htmlFor="nome">
            <Input id="nome" name="nome" required defaultValue={socio.nome} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Telefone" htmlFor="telefone">
              <Input id="telefone" name="telefone" defaultValue={socio.telefone ?? ""} />
            </Field>
            <Field label="E-mail" htmlFor="email">
              <Input id="email" name="email" type="email" defaultValue={socio.email ?? ""} />
            </Field>
          </div>
          <Field label="Participação societária (%)" htmlFor="percentual_participacao">
            <Input
              id="percentual_participacao"
              name="percentual_participacao"
              type="number"
              step="0.01"
              min="0"
              max="100"
              defaultValue={socio.percentual_participacao ?? ""}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm text-ink/70">
            <input type="checkbox" name="ativo" defaultChecked={socio.ativo} className="h-4 w-4 rounded border-thread/50 accent-[var(--terracotta)]" />
            Sócio ativo
          </label>
          <div className="mt-2 flex justify-end gap-3">
            <LinkButton href="/cadastros/socios" variant="ghost">Cancelar</LinkButton>
            <Button type="submit">Salvar alterações</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
