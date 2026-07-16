"use server";

import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";
import { isSupabaseConfigured } from "../supabase/config";

export async function signOutAction() {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/login");
}
