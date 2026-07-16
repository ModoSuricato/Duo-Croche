"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createEncomenda,
  updateEncomenda,
  deleteEncomenda,
  getEncomenda,
  replaceEncomendaItens,
} from "../data/encomendas";
import { createReceita, getReceitas } from "../data/receitas";
import { createCusto, getCustos } from "../data/custos";
import { getVendedores } from "../data/vendedores";
import { todayISO } from "../format";
import type { StatusEncomenda } from "../database.types";

function parseItens(formData: FormData) {
  const produtoIds = formData.getAll("produto_id[]") as string[];
  const quantidades = formData.getAll("quantidade[]") as string[];
  const precos = formData.getAll("preco_unitario[]") as string[];

  return produtoIds.map((produto_id, i) => ({
    produto_id,
    quantidade: Number(quantidades[i] ?? 1),
    preco_unitario: Number(precos[i] ?? 0),
  }));
}

function parseEditaveis(formData: FormData) {
  return {
    cliente_id: (formData.get("cliente_id") as string) || null,
    vendedor_id: (formData.get("vendedor_id") as string) || null,
    data_pedido: String(formData.get("data_pedido")),
    data_entrega_prevista: (formData.get("data_entrega_prevista") as string) || null,
    valor_total: Number(formData.get("valor_total")),
    observacoes: (formData.get("observacoes") as string) || null,
  };
}

function parseInput(formData: FormData) {
  return {
    ...parseEditaveis(formData),
    data_entrega_real: null,
    status: "pendente" as StatusEncomenda,
  };
}

export async function createEncomendaAction(formData: FormData) {
  const input = parseInput(formData);
  const itens = parseItens(formData);
  const encomenda = await createEncomenda(input, itens);
  revalidatePath("/encomendas");
  revalidatePath("/estoque");
  revalidatePath("/");
  redirect(`/encomendas/${encomenda.id}`);
}

export async function updateEncomendaAction(id: string, formData: FormData) {
  await updateEncomenda(id, parseEditaveis(formData));
  await replaceEncomendaItens(id, parseItens(formData));
  revalidatePath("/encomendas");
  revalidatePath(`/encomendas/${id}`);
  revalidatePath("/");
  redirect(`/encomendas/${id}`);
}

export async function deleteEncomendaAction(id: string) {
  await deleteEncomenda(id);
  revalidatePath("/encomendas");
  revalidatePath("/");
}

function calcularComissao(valorTotal: number, tipo: string, valorComissao: number) {
  if (tipo === "percentual") return Math.round(valorTotal * (valorComissao / 100) * 100) / 100;
  if (tipo === "fixo") return valorComissao;
  return 0;
}

/**
 * Ao mudar o status de uma encomenda, avança o fluxo automaticamente:
 * ao marcar como "entregue", gera a receita correspondente e, se o
 * vendedor tiver comissão configurada, gera também o custo de comissão —
 * evitando lançamento manual duplicado dessas duas pontas.
 */
export async function updateStatusEncomendaAction(id: string, novoStatus: StatusEncomenda) {
  const encomenda = await getEncomenda(id);
  if (!encomenda) return;

  const jaEraEntregue = encomenda.status === "entregue";
  const hoje = todayISO();

  await updateEncomenda(id, {
    status: novoStatus,
    data_entrega_real: novoStatus === "entregue" ? encomenda.data_entrega_real ?? hoje : encomenda.data_entrega_real,
  });

  if (novoStatus === "entregue" && !jaEraEntregue) {
    const receitas = await getReceitas();
    const receitaJaExiste = receitas.some((r) => r.encomenda_id === id);

    if (!receitaJaExiste) {
      await createReceita({
        descricao: `Encomenda entregue - ${encomenda.clientes?.nome ?? "Cliente"}`,
        categoria: "encomenda",
        valor: encomenda.valor_total,
        data: hoje,
        cliente_id: encomenda.cliente_id,
        vendedor_id: encomenda.vendedor_id,
        encomenda_id: id,
        forma_pagamento: null,
      });

      if (encomenda.vendedor_id) {
        const vendedores = await getVendedores();
        const vendedor = vendedores.find((v) => v.id === encomenda.vendedor_id);
        if (vendedor && vendedor.tipo_comissao !== "nenhuma") {
          const custos = await getCustos();
          const comissaoJaExiste = custos.some((c) => c.encomenda_id === id && c.categoria === "comissao");
          if (!comissaoJaExiste) {
            const valorComissao = calcularComissao(
              encomenda.valor_total,
              vendedor.tipo_comissao,
              vendedor.valor_comissao,
            );
            await createCusto({
              descricao: `Comissão - ${vendedor.nome} (${encomenda.clientes?.nome ?? "encomenda"})`,
              categoria: "comissao",
              valor: valorComissao,
              data: hoje,
              vendedor_id: vendedor.id,
              encomenda_id: id,
              gerado_automaticamente: true,
            });
          }
        }
      }
    }
  }

  revalidatePath("/encomendas");
  revalidatePath(`/encomendas/${id}`);
  revalidatePath("/receitas");
  revalidatePath("/custos");
  revalidatePath("/");
}
