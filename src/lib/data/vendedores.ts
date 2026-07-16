import { isSupabaseConfigured } from "../supabase/config";
import { createClient } from "../supabase/server";
import { demoVendedores } from "../demo-store";
import type { Vendedor } from "../database.types";

export async function getVendedores(): Promise<Vendedor[]> {
  if (!isSupabaseConfigured) return demoVendedores.list();
  const supabase = await createClient();
  const { data } = await supabase
    .from("vendedores")
    .select("*")
    .order("nome");
  return data ?? [];
}

export async function getVendedor(id: string): Promise<Vendedor | null> {
  const all = await getVendedores();
  return all.find((v) => v.id === id) ?? null;
}

export async function createVendedor(
  input: Omit<Vendedor, "id" | "created_at">,
) {
  if (!isSupabaseConfigured) return demoVendedores.insert(input);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vendedores")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateVendedor(id: string, patch: Partial<Vendedor>) {
  if (!isSupabaseConfigured) return demoVendedores.update(id, patch);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vendedores")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteVendedor(id: string) {
  if (!isSupabaseConfigured) return demoVendedores.remove(id);
  const supabase = await createClient();
  const { error } = await supabase.from("vendedores").delete().eq("id", id);
  if (error) throw error;
}
