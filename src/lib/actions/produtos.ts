"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createProduto, updateProduto, deleteProduto } from "../data/produtos";

function parseInput(formData: FormData) {
  return {
    nome: String(formData.get("nome")),
    categoria: (formData.get("categoria") as string) || null,
    preco_venda: Number(formData.get("preco_venda")),
    custo_producao: Number(formData.get("custo_producao")),
    descricao: (formData.get("descricao") as string) || null,
    ativo: formData.get("ativo") === "on",
  };
}

export async function createProdutoAction(formData: FormData) {
  await createProduto(parseInput(formData));
  revalidatePath("/cadastros/produtos");
  revalidatePath("/estoque");
  redirect("/cadastros/produtos");
}

export async function updateProdutoAction(id: string, formData: FormData) {
  await updateProduto(id, parseInput(formData));
  revalidatePath("/cadastros/produtos");
  revalidatePath("/estoque");
  redirect("/cadastros/produtos");
}

export async function deleteProdutoAction(id: string) {
  await deleteProduto(id);
  revalidatePath("/cadastros/produtos");
  revalidatePath("/estoque");
}
