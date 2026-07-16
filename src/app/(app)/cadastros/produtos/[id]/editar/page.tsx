import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Button, LinkButton } from "@/components/ui/button";
import { getProduto } from "@/lib/data/produtos";
import { updateProdutoAction } from "@/lib/actions/produtos";

export default async function EditarProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const produto = await getProduto(id);
  if (!produto) notFound();

  const updateWithId = updateProdutoAction.bind(null, id);

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Editar produto" subtitle={produto.nome} />

      <Card>
        <form action={updateWithId} className="flex flex-col gap-4 p-6">
          <Field label="Nome" htmlFor="nome">
            <Input id="nome" name="nome" required defaultValue={produto.nome} />
          </Field>
          <Field label="Categoria" htmlFor="categoria">
            <Input id="categoria" name="categoria" defaultValue={produto.categoria ?? ""} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Custo de produção (R$)" htmlFor="custo_producao">
              <Input id="custo_producao" name="custo_producao" type="number" step="0.01" min="0" defaultValue={produto.custo_producao} required />
            </Field>
            <Field label="Preço de venda (R$)" htmlFor="preco_venda">
              <Input id="preco_venda" name="preco_venda" type="number" step="0.01" min="0" defaultValue={produto.preco_venda} required />
            </Field>
          </div>
          <Field label="Descrição" htmlFor="descricao">
            <Textarea id="descricao" name="descricao" rows={3} defaultValue={produto.descricao ?? ""} />
          </Field>
          <label className="flex items-center gap-2 text-sm text-ink/70">
            <input type="checkbox" name="ativo" defaultChecked={produto.ativo} className="h-4 w-4 rounded border-thread/50 accent-[var(--terracotta)]" />
            Produto ativo
          </label>
          <div className="mt-2 flex justify-end gap-3">
            <LinkButton href="/cadastros/produtos" variant="ghost">Cancelar</LinkButton>
            <Button type="submit">Salvar alterações</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
