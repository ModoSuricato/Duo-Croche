import { isSupabaseConfigured } from "../supabase/config";
import { createClient } from "../supabase/server";
import { demoSocios } from "../demo-store";
import type { Socio } from "../database.types";

export async function getSocios(): Promise<Socio[]> {
  if (!isSupabaseConfigured) return demoSocios.list();
  const supabase = await createClient();
  const { data } = await supabase
    .from("socios")
    .select("*")
    .order("nome");
  return data ?? [];
}

export async function getSocio(id: string): Promise<Socio | null> {
  const all = await getSocios();
  return all.find((s) => s.id === id) ?? null;
}

export async function createSocio(
  input: Omit<Socio, "id" | "created_at">,
) {
  if (!isSupabaseConfigured) return demoSocios.insert(input);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("socios")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateSocio(id: string, patch: Partial<Socio>) {
  if (!isSupabaseConfigured) return demoSocios.update(id, patch);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("socios")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteSocio(id: string) {
  if (!isSupabaseConfigured) return demoSocios.remove(id);
  const supabase = await createClient();
  const { error } = await supabase.from("socios").delete().eq("id", id);
  if (error) throw error;
}
