"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSocio, updateSocio, deleteSocio } from "../data/socios";

function parseInput(formData: FormData) {
  return {
    nome: String(formData.get("nome")),
    telefone: (formData.get("telefone") as string) || null,
    email: (formData.get("email") as string) || null,
    percentual_participacao: formData.get("percentual_participacao")
      ? Number(formData.get("percentual_participacao"))
      : null,
    ativo: formData.get("ativo") === "on",
    profile_id: null,
  };
}

export async function createSocioAction(formData: FormData) {
  await createSocio(parseInput(formData));
  revalidatePath("/cadastros/socios");
  redirect("/cadastros/socios");
}

export async function updateSocioAction(id: string, formData: FormData) {
  await updateSocio(id, parseInput(formData));
  revalidatePath("/cadastros/socios");
  redirect("/cadastros/socios");
}

export async function deleteSocioAction(id: string) {
  await deleteSocio(id);
  revalidatePath("/cadastros/socios");
}
