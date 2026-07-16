import { isSupabaseConfigured } from "../supabase/config";
import { createClient } from "../supabase/server";
import { demoClientes } from "../demo-store";
import type { Cliente } from "../database.types";

export async function getClientes(): Promise<Cliente[]> {
  if (!isSupabaseConfigured) return demoClientes.list();
  const supabase = await createClient();
  const { data } = await supabase
    .from("clientes")
    .select("*")
    .order("nome");
  return data ?? [];
}

export async function getCliente(id: string): Promise<Cliente | null> {
  const all = await getClientes();
  return all.find((c) => c.id === id) ?? null;
}

export async function createCliente(
  input: Omit<Cliente, "id" | "created_at">,
) {
  if (!isSupabaseConfigured) return demoClientes.insert(input);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clientes")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCliente(id: string, patch: Partial<Cliente>) {
  if (!isSupabaseConfigured) return demoClientes.update(id, patch);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clientes")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCliente(id: string) {
  if (!isSupabaseConfigured) return demoClientes.remove(id);
  const supabase = await createClient();
  const { error } = await supabase.from("clientes").delete().eq("id", id);
  if (error) throw error;
}
