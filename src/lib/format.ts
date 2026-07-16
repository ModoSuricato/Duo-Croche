export function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatDate(value: string | null) {
  if (!value) return "—";
  const [year, month, day] = value.slice(0, 10).split("-");
  return `${day}/${month}/${year}`;
}

export function todayISO() {
  // Usa o fuso horário do Brasil (independente de onde o servidor roda,
  // ex: Vercel roda em UTC, o que deslocaria a data perto da meia-noite)
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  return partes; // en-CA formata como YYYY-MM-DD
}
