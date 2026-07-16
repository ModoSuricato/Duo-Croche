"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createCusto, updateCusto, deleteCusto } from "../data/custos";
import type { CategoriaCusto } from "../database.types";

function parseInput(formData: FormData) {
  return {
    descricao: String(formData.get("descricao")),
    categoria: String(formData.get("categoria")) as CategoriaCusto,
    valor: Number(formData.get("valor")),
    data: String(formData.get("data")),
    vendedor_id: (formData.get("vendedor_id") as string) || null,
    encomenda_id: null,
    gerado_automaticamente: false,
  };
}

export async function createCustoAction(formData: FormData) {
  await createCusto(parseInput(formData));
  revalidatePath("/custos");
  revalidatePath("/");
  redirect("/custos");
}

export async function updateCustoAction(id: string, formData: FormData) {
  await updateCusto(id, parseInput(formData));
  revalidatePath("/custos");
  revalidatePath("/");
  redirect("/custos");
}

export async function deleteCustoAction(id: string) {
  await deleteCusto(id);
  revalidatePath("/custos");
  revalidatePath("/");
}
