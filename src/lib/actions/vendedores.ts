"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createVendedor, updateVendedor, deleteVendedor } from "../data/vendedores";
import type { TipoComissao } from "../database.types";

function parseInput(formData: FormData) {
  return {
    nome: String(formData.get("nome")),
    telefone: (formData.get("telefone") as string) || null,
    email: (formData.get("email") as string) || null,
    tipo_comissao: String(formData.get("tipo_comissao")) as TipoComissao,
    valor_comissao: Number(formData.get("valor_comissao")) || 0,
    ativo: formData.get("ativo") === "on",
    profile_id: null,
  };
}

export async function createVendedorAction(formData: FormData) {
  await createVendedor(parseInput(formData));
  revalidatePath("/cadastros/vendedores");
  redirect("/cadastros/vendedores");
}

export async function updateVendedorAction(id: string, formData: FormData) {
  await updateVendedor(id, parseInput(formData));
  revalidatePath("/cadastros/vendedores");
  redirect("/cadastros/vendedores");
}

export async function deleteVendedorAction(id: string) {
  await deleteVendedor(id);
  revalidatePath("/cadastros/vendedores");
}
