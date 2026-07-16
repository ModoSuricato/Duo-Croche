"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createCliente, updateCliente, deleteCliente } from "../data/clientes";

function parseInput(formData: FormData) {
  return {
    nome: String(formData.get("nome")),
    telefone: (formData.get("telefone") as string) || null,
    email: (formData.get("email") as string) || null,
    endereco: (formData.get("endereco") as string) || null,
    observacoes: (formData.get("observacoes") as string) || null,
  };
}

export async function createClienteAction(formData: FormData) {
  await createCliente(parseInput(formData));
  revalidatePath("/cadastros/clientes");
  redirect("/cadastros/clientes");
}

export async function updateClienteAction(id: string, formData: FormData) {
  await updateCliente(id, parseInput(formData));
  revalidatePath("/cadastros/clientes");
  redirect("/cadastros/clientes");
}

export async function deleteClienteAction(id: string) {
  await deleteCliente(id);
  revalidatePath("/cadastros/clientes");
}
