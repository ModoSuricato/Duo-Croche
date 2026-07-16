import { isSupabaseConfigured } from "../supabase/config";
import { createClient } from "../supabase/server";
import type { Profile } from "../database.types";

export async function getCurrentProfile(): Promise<Profile | null> {
  if (!isSupabaseConfigured) {
    return {
      id: "demo-user",
      nome: "Modo Demonstração",
      email: "demo@duocroche.com",
      papel: "admin",
      ativo: true,
      created_at: new Date().toISOString(),
    };
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  return data;
}
