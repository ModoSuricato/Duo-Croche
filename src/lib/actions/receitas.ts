"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createReceita, updateReceita, deleteReceita } from "../data/receitas";
import type { CategoriaReceita } from "../database.types";

function parseInput(formData: FormData) {
  return {
    descricao: String(formData.get("descricao")),
    categoria: String(formData.get("categoria")) as CategoriaReceita,
    valor: Number(formData.get("valor")),
    data: String(formData.get("data")),
    cliente_id: (formData.get("cliente_id") as string) || null,
    vendedor_id: (formData.get("vendedor_id") as string) || null,
    encomenda_id: null,
    forma_pagamento: (formData.get("forma_pagamento") as string) || null,
  };
}

export async function createReceitaAction(formData: FormData) {
  await createReceita(parseInput(formData));
  revalidatePath("/receitas");
  revalidatePath("/");
  redirect("/receitas");
}

export async function updateReceitaAction(id: string, formData: FormData) {
  await updateReceita(id, parseInput(formData));
  revalidatePath("/receitas");
  revalidatePath("/");
  redirect("/receitas");
}

export async function deleteReceitaAction(id: string) {
  await deleteReceita(id);
  revalidatePath("/receitas");
  revalidatePath("/");
}
