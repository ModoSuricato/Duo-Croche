import type { Custo, Encomenda, Receita } from "./database.types";

const MESES = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

export function buildMonthlySeries(
  receitas: Receita[],
  custos: Custo[],
  meses = 6,
) {
  const now = new Date();
  const buckets: { key: string; mes: string; receitas: number; custos: number }[] = [];

  for (let i = meses - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      mes: `${MESES[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`,
      receitas: 0,
      custos: 0,
    });
  }

  const byKey = new Map(buckets.map((b) => [b.key, b]));

  for (const r of receitas) {
    const key = r.data.slice(0, 7);
    const bucket = byKey.get(key);
    if (bucket) bucket.receitas += Number(r.valor);
  }
  for (const c of custos) {
    const key = c.data.slice(0, 7);
    const bucket = byKey.get(key);
    if (bucket) bucket.custos += Number(c.valor);
  }

  return buckets.map((b) => ({
    mes: b.mes,
    receitas: Math.round(b.receitas * 100) / 100,
    custos: Math.round(b.custos * 100) / 100,
    liquido: Math.round((b.receitas - b.custos) * 100) / 100,
  }));
}

export function isAtrasada(encomenda: Encomenda, hojeISO: string) {
  return (
    encomenda.status !== "entregue" &&
    encomenda.status !== "cancelado" &&
    !!encomenda.data_entrega_prevista &&
    encomenda.data_entrega_prevista < hojeISO
  );
}
