import type {
  Cliente,
  Custo,
  Encomenda,
  EncomendaItem,
  Estoque,
  Produto,
  Receita,
  Socio,
  Vendedor,
} from "./database.types";

/**
 * Loja em memória usada apenas quando o Supabase ainda não foi configurado
 * (.env.local ausente). Permite navegar e testar a aplicação inteira antes
 * de existir um banco real. Os dados são reiniciados quando o servidor
 * de desenvolvimento reinicia — nunca é usada em produção.
 */

function id() {
  return crypto.randomUUID();
}

function createStore<T extends { id: string; created_at?: string }>(
  seed: T[],
) {
  let rows = [...seed];
  return {
    list: async () => rows,
    get: async (rowId: string) => rows.find((r) => r.id === rowId) ?? null,
    insert: async (input: Omit<T, "id" | "created_at">) => {
      const row = {
        ...input,
        id: id(),
        created_at: new Date().toISOString(),
      } as T;
      rows = [row, ...rows];
      return row;
    },
    update: async (rowId: string, patch: Partial<T>) => {
      rows = rows.map((r) => (r.id === rowId ? { ...r, ...patch } : r));
      return rows.find((r) => r.id === rowId) ?? null;
    },
    remove: async (rowId: string) => {
      rows = rows.filter((r) => r.id !== rowId);
    },
  };
}

const now = new Date();
const iso = (daysFromNow: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
};

export const demoSocios = createStore<Socio>([
  {
    id: "s1",
    profile_id: null,
    nome: "Ana Beatriz",
    percentual_participacao: 50,
    telefone: "(11) 99999-0001",
    email: "ana@duocroche.com",
    ativo: true,
    created_at: iso(-200),
  },
  {
    id: "s2",
    profile_id: null,
    nome: "Carla Duarte",
    percentual_participacao: 50,
    telefone: "(11) 99999-0002",
    email: "carla@duocroche.com",
    ativo: true,
    created_at: iso(-200),
  },
]);

export const demoVendedores = createStore<Vendedor>([
  {
    id: "v1",
    profile_id: null,
    nome: "Juliana Prita",
    telefone: "(11) 98888-1111",
    email: "juliana@duocroche.com",
    tipo_comissao: "percentual",
    valor_comissao: 10,
    ativo: true,
    created_at: iso(-150),
  },
  {
    id: "v2",
    profile_id: null,
    nome: "Marcos Silva",
    telefone: "(11) 98888-2222",
    email: "marcos@duocroche.com",
    tipo_comissao: "fixo",
    valor_comissao: 15,
    ativo: true,
    created_at: iso(-90),
  },
]);

export const demoClientes = createStore<Cliente>([
  {
    id: "c1",
    nome: "Fernanda Lima",
    telefone: "(11) 97777-1234",
    email: "fernanda@example.com",
    endereco: "Rua das Flores, 123 - São Paulo/SP",
    observacoes: "Prefere tons pastel",
    created_at: iso(-120),
  },
  {
    id: "c2",
    nome: "Ricardo Alves",
    telefone: "(11) 96666-5678",
    email: "ricardo@example.com",
    endereco: "Av. Central, 500 - Campinas/SP",
    observacoes: null,
    created_at: iso(-60),
  },
  {
    id: "c3",
    nome: "Studio Bella Decor",
    telefone: "(19) 95555-4321",
    email: "contato@belladecor.com",
    endereco: "Rua Comercial, 88 - Campinas/SP",
    observacoes: "Cliente recorrente, encomendas em lote",
    created_at: iso(-30),
  },
]);

export const demoProdutos = createStore<Produto>([
  {
    id: "p1",
    nome: "Amigurumi Ursinho",
    categoria: "Amigurumi",
    preco_venda: 89.9,
    custo_producao: 28,
    descricao: "Ursinho de crochê 20cm, fio de algodão",
    ativo: true,
    created_at: iso(-180),
  },
  {
    id: "p2",
    nome: "Tapete Redondo Boho",
    categoria: "Decoração",
    preco_venda: 159.9,
    custo_producao: 55,
    descricao: "Tapete de crochê 80cm diâmetro",
    ativo: true,
    created_at: iso(-160),
  },
  {
    id: "p3",
    nome: "Bolsa de Crochê Verão",
    categoria: "Acessórios",
    preco_venda: 129.9,
    custo_producao: 40,
    descricao: "Bolsa de praia em crochê com forro",
    ativo: true,
    created_at: iso(-100),
  },
  {
    id: "p4",
    nome: "Manta Ponto Zig-Zag",
    categoria: "Decoração",
    preco_venda: 249.9,
    custo_producao: 90,
    descricao: "Manta 1,5m x 2m",
    ativo: true,
    created_at: iso(-45),
  },
]);

export const demoEstoque = createStore<Estoque>([
  { id: "e1", produto_id: "p1", quantidade: 12, atualizado_em: now.toISOString() },
  { id: "e2", produto_id: "p2", quantidade: 4, atualizado_em: now.toISOString() },
  { id: "e3", produto_id: "p3", quantidade: 7, atualizado_em: now.toISOString() },
  { id: "e4", produto_id: "p4", quantidade: 2, atualizado_em: now.toISOString() },
]);

export const demoEncomendas = createStore<Encomenda>([
  {
    id: "o1",
    cliente_id: "c1",
    vendedor_id: "v1",
    data_pedido: iso(-20),
    data_entrega_prevista: iso(-2),
    data_entrega_real: null,
    status: "em_producao",
    valor_total: 249.9,
    observacoes: "Cor: rosa queimado",
    created_at: iso(-20),
  },
  {
    id: "o2",
    cliente_id: "c3",
    vendedor_id: "v2",
    data_pedido: iso(-10),
    data_entrega_prevista: iso(5),
    data_entrega_real: null,
    status: "pendente",
    valor_total: 899.0,
    observacoes: "Lote de 10 amigurumis para vitrine",
    created_at: iso(-10),
  },
  {
    id: "o3",
    cliente_id: "c2",
    vendedor_id: "v1",
    data_pedido: iso(-35),
    data_entrega_prevista: iso(-15),
    data_entrega_real: iso(-14),
    status: "entregue",
    valor_total: 159.9,
    observacoes: null,
    created_at: iso(-35),
  },
]);

export const demoEncomendaItens = createStore<EncomendaItem>([
  { id: "i1", encomenda_id: "o1", produto_id: "p4", quantidade: 1, preco_unitario: 249.9 },
  { id: "i2", encomenda_id: "o2", produto_id: "p1", quantidade: 10, preco_unitario: 89.9 },
  { id: "i3", encomenda_id: "o3", produto_id: "p2", quantidade: 1, preco_unitario: 159.9 },
]);

export const demoReceitas = createStore<Receita>([
  {
    id: "r1",
    descricao: "Venda avulsa - Bolsa Verão",
    categoria: "venda",
    valor: 129.9,
    data: iso(-8),
    cliente_id: "c2",
    vendedor_id: "v2",
    encomenda_id: null,
    forma_pagamento: "Pix",
    created_at: iso(-8),
  },
  {
    id: "r2",
    descricao: "Encomenda entregue - Tapete Boho",
    categoria: "encomenda",
    valor: 159.9,
    data: iso(-14),
    cliente_id: "c2",
    vendedor_id: "v1",
    encomenda_id: "o3",
    forma_pagamento: "Cartão",
    created_at: iso(-14),
  },
]);

export const demoCustos = createStore<Custo>([
  {
    id: "cu1",
    descricao: "Fio de algodão premium (10 novelos)",
    categoria: "materia_prima",
    valor: 180,
    data: iso(-25),
    vendedor_id: null,
    encomenda_id: null,
    gerado_automaticamente: false,
    created_at: iso(-25),
  },
  {
    id: "cu2",
    descricao: "Comissão - Tapete Boho",
    categoria: "comissao",
    valor: 15.99,
    data: iso(-14),
    vendedor_id: "v1",
    encomenda_id: "o3",
    gerado_automaticamente: true,
    created_at: iso(-14),
  },
  {
    id: "cu3",
    descricao: "Embalagens personalizadas",
    categoria: "embalagem",
    valor: 65,
    data: iso(-5),
    vendedor_id: null,
    encomenda_id: null,
    gerado_automaticamente: false,
    created_at: iso(-5),
  },
]);
