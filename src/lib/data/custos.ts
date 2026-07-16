import { isSupabaseConfigured } from "../supabase/config";
import { createClient } from "../supabase/server";
import { demoCustos, demoVendedores } from "../demo-store";
import type { Custo } from "../database.types";

export async function getCustos(): Promise<Custo[]> {
  if (!isSupabaseConfigured) {
    const rows = await demoCustos.list();
    const vendedores = await demoVendedores.list();
    return rows
      .map((r) => ({
        ...r,
        vendedores: vendedores.find((v) => v.id === r.vendedor_id),
      }))
      .sort((a, b) => (a.data < b.data ? 1 : -1));
  }
  const supabase = await createClient();
  const { data } = await supabase
    .from("custos")
    .select("*, vendedores(*)")
    .order("data", { ascending: false });
  return data ?? [];
}

export async function getCusto(id: string): Promise<Custo | null> {
  const all = await getCustos();
  return all.find((c) => c.id === id) ?? null;
}

export async function createCusto(input: Omit<Custo, "id" | "created_at">) {
  if (!isSupabaseConfigured) return demoCustos.insert(input);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("custos")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCusto(id: string, patch: Partial<Custo>) {
  if (!isSupabaseConfigured) return demoCustos.update(id, patch);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("custos")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCusto(id: string) {
  if (!isSupabaseConfigured) return demoCustos.remove(id);
  const supabase = await createClient();
  const { error } = await supabase.from("custos").delete().eq("id", id);
  if (error) throw error;
}
