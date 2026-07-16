"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export function ReceitasCustosChart({
  data,
}: {
  data: { mes: string; receitas: number; custos: number; liquido: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="4 6" stroke="var(--thread)" vertical={false} />
        <XAxis
          dataKey="mes"
          tick={{ fill: "var(--ink)", fontSize: 12, opacity: 0.6 }}
          axisLine={{ stroke: "var(--thread)" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "var(--ink)", fontSize: 12, opacity: 0.6 }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip
          formatter={(value) =>
            Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
          }
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--thread)",
            borderRadius: 12,
            fontSize: 13,
          }}
        />
        <Bar dataKey="receitas" name="Receitas" fill="var(--sage)" radius={[6, 6, 0, 0]} barSize={18} />
        <Bar dataKey="custos" name="Custos" fill="var(--rose)" radius={[6, 6, 0, 0]} barSize={18} />
        <Line
          dataKey="liquido"
          name="Líquido"
          stroke="var(--terracotta)"
          strokeWidth={2.5}
          dot={{ r: 3, fill: "var(--terracotta)" }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
