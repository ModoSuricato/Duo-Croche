import { Badge } from "@/components/ui/badge";
import type { StatusEncomenda } from "@/lib/database.types";

const config: Record<StatusEncomenda, { label: string; tone: "neutral" | "gold" | "sage" | "rose" | "terracotta" }> = {
  pendente: { label: "Pendente", tone: "neutral" },
  em_producao: { label: "Em produção", tone: "gold" },
  pronto: { label: "Pronto", tone: "terracotta" },
  entregue: { label: "Entregue", tone: "sage" },
  cancelado: { label: "Cancelado", tone: "rose" },
};

export function StatusBadge({ status }: { status: StatusEncomenda }) {
  const c = config[status];
  return <Badge tone={c.tone}>{c.label}</Badge>;
}
