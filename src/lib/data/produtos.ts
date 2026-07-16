import { isSupabaseConfigured } from "../supabase/config";
import { createClient } from "../supabase/server";
import { demoProdutos } from "../demo-store";
import type { Produto } from "../database.types";

export async function getProdutos(): Promise<Produto[]> {
  if (!isSupabaseConfigured) return demoProdutos.list();
  const supabase = await createClient();
  const { data } = await supabase
    .from("produtos")
    .select("*")
    .order("nome");
  return data ?? [];
}

export async function getProduto(id: string): Promise<Produto | null> {
  const all = await getProdutos();
  return all.find((p) => p.id === id) ?? null;
}

export async function createProduto(
  input: Omit<Produto, "id" | "created_at">,
) {
  if (!isSupabaseConfigured) return demoProdutos.insert(input);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("produtos")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProduto(id: string, patch: Partial<Produto>) {
  if (!isSupabaseConfigured) return demoProdutos.update(id, patch);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("produtos")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProduto(id: string) {
  if (!isSupabaseConfigured) return demoProdutos.remove(id);
  const supabase = await createClient();
  const { error } = await supabase.from("produtos").delete().eq("id", id);
  if (error) throw error;
}
