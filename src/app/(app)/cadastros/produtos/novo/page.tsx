import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Button, LinkButton } from "@/components/ui/button";
import { createProdutoAction } from "@/lib/actions/produtos";

export default function NovoProdutoPage() {
  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Novo produto" />

      <Card>
        <form action={createProdutoAction} className="flex flex-col gap-4 p-6">
          <Field label="Nome" htmlFor="nome">
            <Input id="nome" name="nome" required placeholder="Ex: Amigurumi Ursinho" />
          </Field>
          <Field label="Categoria" htmlFor="categoria">
            <Input id="categoria" name="categoria" placeholder="Amigurumi, Decoração, Acessórios..." />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Custo de produção (R$)" htmlFor="custo_producao">
              <Input id="custo_producao" name="custo_producao" type="number" step="0.01" min="0" defaultValue={0} required />
            </Field>
            <Field label="Preço de venda (R$)" htmlFor="preco_venda">
              <Input id="preco_venda" name="preco_venda" type="number" step="0.01" min="0" defaultValue={0} required />
            </Field>
          </div>
          <Field label="Descrição" htmlFor="descricao">
            <Textarea id="descricao" name="descricao" rows={3} />
          </Field>
          <label className="flex items-center gap-2 text-sm text-ink/70">
            <input type="checkbox" name="ativo" defaultChecked className="h-4 w-4 rounded border-thread/50 accent-[var(--terracotta)]" />
            Produto ativo
          </label>
          <div className="mt-2 flex justify-end gap-3">
            <LinkButton href="/cadastros/produtos" variant="ghost">Cancelar</LinkButton>
            <Button type="submit">Salvar produto</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
