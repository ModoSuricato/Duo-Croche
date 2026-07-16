"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { Produto } from "@/lib/database.types";
import { formatCurrency } from "@/lib/format";

interface Row {
  produto_id: string;
  quantidade: number;
  preco_unitario: number;
}

export function ItensForm({
  produtos,
  initialItens,
}: {
  produtos: Produto[];
  initialItens?: Row[];
}) {
  const [itens, setItens] = useState<Row[]>(
    initialItens && initialItens.length > 0
      ? initialItens
      : [{ produto_id: produtos[0]?.id ?? "", quantidade: 1, preco_unitario: produtos[0]?.preco_venda ?? 0 }],
  );

  const total = useMemo(
    () => itens.reduce((acc, i) => acc + i.quantidade * i.preco_unitario, 0),
    [itens],
  );

  function updateRow(index: number, patch: Partial<Row>) {
    setItens((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function addRow() {
    setItens((prev) => [
      ...prev,
      { produto_id: produtos[0]?.id ?? "", quantidade: 1, preco_unitario: produtos[0]?.preco_venda ?? 0 },
    ]);
  }

  function removeRow(index: number) {
    setItens((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-ink/80">Itens da encomenda</span>

      <div className="flex flex-col gap-2 rounded-xl border border-thread/40 bg-white/50 p-3">
        {itens.map((row, index) => (
          <div key={index} className="flex items-center gap-2">
            <select
              name="produto_id[]"
              value={row.produto_id}
              onChange={(e) => {
                const produto = produtos.find((p) => p.id === e.target.value);
                updateRow(index, {
                  produto_id: e.target.value,
                  preco_unitario: produto?.preco_venda ?? row.preco_unitario,
                });
              }}
              className="min-w-0 flex-1 rounded-lg border border-thread/40 bg-white px-2.5 py-2 text-sm outline-none focus:ring-2 focus:ring-terracotta/25"
            >
              {produtos.map((p) => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
            <input
              type="number"
              name="quantidade[]"
              min={1}
              value={row.quantidade}
              onChange={(e) => updateRow(index, { quantidade: Number(e.target.value) })}
              className="w-16 rounded-lg border border-thread/40 bg-white px-2 py-2 text-sm outline-none focus:ring-2 focus:ring-terracotta/25"
            />
            <input
              type="number"
              name="preco_unitario[]"
              min={0}
              step="0.01"
              value={row.preco_unitario}
              onChange={(e) => updateRow(index, { preco_unitario: Number(e.target.value) })}
              className="w-24 rounded-lg border border-thread/40 bg-white px-2 py-2 text-sm outline-none focus:ring-2 focus:ring-terracotta/25"
            />
            <button
              type="button"
              onClick={() => removeRow(index)}
              disabled={itens.length === 1}
              className="rounded-lg p-2 text-rose transition hover:bg-rose/10 disabled:opacity-30"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addRow}
          className="mt-1 flex items-center gap-1.5 self-start rounded-lg px-2.5 py-1.5 text-xs font-semibold text-terracotta-dark transition hover:bg-terracotta/10"
        >
          <Plus size={14} /> Adicionar item
        </button>
      </div>

      <div className="mt-2 flex justify-end text-sm text-ink/70">
        Total: <span className="ml-1.5 font-semibold text-ink">{formatCurrency(total)}</span>
      </div>
      <input type="hidden" name="valor_total" value={total} />
    </div>
  );
}
