import { Wallet, Receipt, TrendingUp, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ReceitasCustosChart } from "@/components/dashboard/receitas-custos-chart";
import { getReceitas } from "@/lib/data/receitas";
import { getCustos } from "@/lib/data/custos";
import { getEncomendas } from "@/lib/data/encomendas";
import { buildMonthlySeries, isAtrasada } from "@/lib/dashboard";
import { formatCurrency, formatDate, todayISO } from "@/lib/format";
import Link from "next/link";

export default async function DashboardPage() {
  const [receitas, custos, encomendas] = await Promise.all([
    getReceitas(),
    getCustos(),
    getEncomendas(),
  ]);

  const hoje = todayISO();
  const mesAtual = hoje.slice(0, 7);

  const receitaTotal = receitas.reduce((acc, r) => acc + Number(r.valor), 0);
  const custoTotal = custos.reduce((acc, c) => acc + Number(c.valor), 0);
  const lucroLiquido = receitaTotal - custoTotal;

  const receitaMes = receitas
    .filter((r) => r.data.startsWith(mesAtual))
    .reduce((acc, r) => acc + Number(r.valor), 0);
  const custoMes = custos
    .filter((c) => c.data.startsWith(mesAtual))
    .reduce((acc, c) => acc + Number(c.valor), 0);

  const atrasadas = encomendas.filter((e) => isAtrasada(e, hoje));
  const serie = buildMonthlySeries(receitas, custos);

  return (
    <div>
      <PageHeader
        title="Dashboard Geral"
        subtitle="Visão consolidada das finanças e encomendas da DuoCrochê"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Receita total"
          value={formatCurrency(receitaTotal)}
          icon={Wallet}
          tone="sage"
          hint={`${formatCurrency(receitaMes)} neste mês`}
        />
        <StatCard
          label="Custo total"
          value={formatCurrency(custoTotal)}
          icon={Receipt}
          tone="rose"
          hint={`${formatCurrency(custoMes)} neste mês`}
        />
        <StatCard
          label="Lucro líquido"
          value={formatCurrency(lucroLiquido)}
          icon={TrendingUp}
          tone={lucroLiquido >= 0 ? "terracotta" : "rose"}
          hint={`${formatCurrency(receitaMes - custoMes)} neste mês`}
        />
        <StatCard
          label="Encomendas atrasadas"
          value={String(atrasadas.length)}
          icon={AlertTriangle}
          tone={atrasadas.length > 0 ? "rose" : "gold"}
          hint={atrasadas.length > 0 ? "Atenção necessária" : "Tudo em dia"}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader
            title="Receitas x Custos"
            subtitle="Últimos 6 meses, com resultado líquido"
          />
          <div className="p-4">
            <ReceitasCustosChart data={serie} />
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader
            title="Encomendas atrasadas"
            subtitle="Prazo de entrega já vencido"
          />
          <div className="p-4">
            {atrasadas.length === 0 ? (
              <EmptyState
                title="Nenhuma encomenda atrasada"
                description="Todas as entregas estão dentro do prazo. Bom trabalho!"
              />
            ) : (
              <ul className="flex flex-col gap-3">
                {atrasadas.map((e) => (
                  <li key={e.id}>
                    <Link
                      href={`/encomendas/${e.id}`}
                      className="flex items-center justify-between gap-3 rounded-xl border border-rose/25 bg-rose/5 px-4 py-3 transition hover:bg-rose/10"
                    >
                      <div>
                        <p className="text-sm font-semibold text-ink">
                          {e.clientes?.nome ?? "Cliente não identificado"}
                        </p>
                        <p className="text-xs text-ink/50">
                          Previsto para {formatDate(e.data_entrega_prevista)}
                        </p>
                      </div>
                      <Badge tone="rose">{formatCurrency(e.valor_total)}</Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
