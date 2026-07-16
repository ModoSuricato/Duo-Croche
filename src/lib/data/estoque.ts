import { isSupabaseConfigured } from "../supabase/config";
import { createClient } from "../supabase/server";
import { demoEstoque, demoProdutos } from "../demo-store";
import type { Estoque } from "../database.types";

export async function getEstoque(): Promise<Estoque[]> {
  if (!isSupabaseConfigured) {
    const rows = await demoEstoque.list();
    const produtos = await demoProdutos.list();
    return rows.map((r) => ({
      ...r,
      produtos: produtos.find((p) => p.id === r.produto_id),
    }));
  }
  const supabase = await createClient();
  const { data } = await supabase
    .from("estoque")
    .select("*, produtos(*)")
    .order("atualizado_em", { ascending: false });
  return data ?? [];
}

export async function upsertEstoque(produtoId: string, quantidade: number) {
  if (!isSupabaseConfigured) {
    const rows = await demoEstoque.list();
    const existing = rows.find((r) => r.produto_id === produtoId);
    if (existing) {
      return demoEstoque.update(existing.id, {
        quantidade,
        atualizado_em: new Date().toISOString(),
      });
    }
    return demoEstoque.insert({
      produto_id: produtoId,
      quantidade,
      atualizado_em: new Date().toISOString(),
    });
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("estoque")
    .upsert(
      { produto_id: produtoId, quantidade, atualizado_em: new Date().toISOString() },
      { onConflict: "produto_id" },
    )
    .select()
    .single();
  if (error) throw error;
  return data;
}
