import { isSupabaseConfigured } from "../supabase/config";
import { createClient } from "../supabase/server";
import { demoReceitas, demoClientes, demoVendedores } from "../demo-store";
import type { Receita } from "../database.types";

export async function getReceitas(): Promise<Receita[]> {
  if (!isSupabaseConfigured) {
    const rows = await demoReceitas.list();
    const clientes = await demoClientes.list();
    const vendedores = await demoVendedores.list();
    return rows
      .map((r) => ({
        ...r,
        clientes: clientes.find((c) => c.id === r.cliente_id),
        vendedores: vendedores.find((v) => v.id === r.vendedor_id),
      }))
      .sort((a, b) => (a.data < b.data ? 1 : -1));
  }
  const supabase = await createClient();
  const { data } = await supabase
    .from("receitas")
    .select("*, clientes(*), vendedores(*)")
    .order("data", { ascending: false });
  return data ?? [];
}

export async function getReceita(id: string): Promise<Receita | null> {
  const all = await getReceitas();
  return all.find((r) => r.id === id) ?? null;
}

export async function createReceita(input: Omit<Receita, "id" | "created_at">) {
  if (!isSupabaseConfigured) return demoReceitas.insert(input);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("receitas")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateReceita(id: string, patch: Partial<Receita>) {
  if (!isSupabaseConfigured) return demoReceitas.update(id, patch);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("receitas")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteReceita(id: string) {
  if (!isSupabaseConfigured) return demoReceitas.remove(id);
  const supabase = await createClient();
  const { error } = await supabase.from("receitas").delete().eq("id", id);
  if (error) throw error;
}
