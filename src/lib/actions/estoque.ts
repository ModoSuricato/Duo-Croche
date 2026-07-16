"use server";

import { revalidatePath } from "next/cache";
import { upsertEstoque } from "../data/estoque";

export async function atualizarEstoqueAction(formData: FormData) {
  const produtoId = String(formData.get("produto_id"));
  const quantidade = Number(formData.get("quantidade"));
  await upsertEstoque(produtoId, quantidade);
  revalidatePath("/estoque");
}
