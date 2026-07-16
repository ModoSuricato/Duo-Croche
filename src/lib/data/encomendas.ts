import { isSupabaseConfigured } from "../supabase/config";
import { createClient } from "../supabase/server";
import {
  demoEncomendas,
  demoEncomendaItens,
  demoClientes,
  demoVendedores,
  demoProdutos,
} from "../demo-store";
import type { Encomenda, EncomendaItem } from "../database.types";

export async function getEncomendas(): Promise<Encomenda[]> {
  if (!isSupabaseConfigured) {
    const rows = await demoEncomendas.list();
    const clientes = await demoClientes.list();
    const vendedores = await demoVendedores.list();
    const itens = await demoEncomendaItens.list();
    const produtos = await demoProdutos.list();
    return rows
      .map((r) => ({
        ...r,
        clientes: clientes.find((c) => c.id === r.cliente_id),
        vendedores: vendedores.find((v) => v.id === r.vendedor_id),
        encomenda_itens: itens
          .filter((i) => i.encomenda_id === r.id)
          .map((i) => ({ ...i, produtos: produtos.find((p) => p.id === i.produto_id) })),
      }))
      .sort((a, b) => (a.data_pedido < b.data_pedido ? 1 : -1));
  }
  const supabase = await createClient();
  const { data } = await supabase
    .from("encomendas")
    .select("*, clientes(*), vendedores(*), encomenda_itens(*, produtos(*))")
    .order("data_pedido", { ascending: false });
  return data ?? [];
}

export async function getEncomenda(id: string): Promise<Encomenda | null> {
  const all = await getEncomendas();
  return all.find((e) => e.id === id) ?? null;
}

export async function createEncomenda(
  input: Omit<Encomenda, "id" | "created_at">,
  itens: Omit<EncomendaItem, "id" | "encomenda_id">[],
) {
  if (!isSupabaseConfigured) {
    const row = await demoEncomendas.insert(input);
    for (const item of itens) {
      await demoEncomendaItens.insert({ ...item, encomenda_id: row.id });
    }
    return row;
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("encomendas")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  if (itens.length > 0) {
    const { error: itensError } = await supabase
      .from("encomenda_itens")
      .insert(itens.map((i) => ({ ...i, encomenda_id: data.id })));
    if (itensError) throw itensError;
  }
  return data;
}

export async function replaceEncomendaItens(
  encomendaId: string,
  itens: Omit<EncomendaItem, "id" | "encomenda_id">[],
) {
  if (!isSupabaseConfigured) {
    const existentes = await demoEncomendaItens.list();
    for (const item of existentes.filter((i) => i.encomenda_id === encomendaId)) {
      await demoEncomendaItens.remove(item.id);
    }
    for (const item of itens) {
      await demoEncomendaItens.insert({ ...item, encomenda_id: encomendaId });
    }
    return;
  }
  const supabase = await createClient();
  const { error: deleteError } = await supabase
    .from("encomenda_itens")
    .delete()
    .eq("encomenda_id", encomendaId);
  if (deleteError) throw deleteError;
  if (itens.length > 0) {
    const { error: insertError } = await supabase
      .from("encomenda_itens")
      .insert(itens.map((i) => ({ ...i, encomenda_id: encomendaId })));
    if (insertError) throw insertError;
  }
}

export async function updateEncomenda(id: string, patch: Partial<Encomenda>) {
  if (!isSupabaseConfigured) return demoEncomendas.update(id, patch);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("encomendas")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteEncomenda(id: string) {
  if (!isSupabaseConfigured) return demoEncomendas.remove(id);
  const supabase = await createClient();
  const { error } = await supabase.from("encomendas").delete().eq("id", id);
  if (error) throw error;
}
