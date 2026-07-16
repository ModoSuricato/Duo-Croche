export type Papel = "admin" | "socio" | "vendedor";
export type TipoComissao = "percentual" | "fixo" | "nenhuma";
export type StatusEncomenda =
  | "pendente"
  | "em_producao"
  | "pronto"
  | "entregue"
  | "cancelado";
export type CategoriaReceita = "venda" | "encomenda" | "outra";
export type CategoriaCusto =
  | "materia_prima"
  | "comissao"
  | "embalagem"
  | "marketing"
  | "operacional"
  | "outros";

export interface Profile {
  id: string;
  nome: string;
  email: string;
  papel: Papel;
  ativo: boolean;
  created_at: string;
}

export interface Socio {
  id: string;
  profile_id: string | null;
  nome: string;
  percentual_participacao: number | null;
  telefone: string | null;
  email: string | null;
  ativo: boolean;
  created_at: string;
}

export interface Vendedor {
  id: string;
  profile_id: string | null;
  nome: string;
  telefone: string | null;
  email: string | null;
  tipo_comissao: TipoComissao;
  valor_comissao: number;
  ativo: boolean;
  created_at: string;
}

export interface Cliente {
  id: string;
  nome: string;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  observacoes: string | null;
  created_at: string;
}

export interface Produto {
  id: string;
  nome: string;
  categoria: string | null;
  preco_venda: number;
  custo_producao: number;
  descricao: string | null;
  ativo: boolean;
  created_at: string;
}

export interface Estoque {
  id: string;
  produto_id: string;
  quantidade: number;
  atualizado_em: string;
  produtos?: Produto;
}

export interface Encomenda {
  id: string;
  cliente_id: string | null;
  vendedor_id: string | null;
  data_pedido: string;
  data_entrega_prevista: string | null;
  data_entrega_real: string | null;
  status: StatusEncomenda;
  valor_total: number;
  observacoes: string | null;
  created_at: string;
  clientes?: Cliente;
  vendedores?: Vendedor;
  encomenda_itens?: EncomendaItem[];
}

export interface EncomendaItem {
  id: string;
  encomenda_id: string;
  produto_id: string | null;
  quantidade: number;
  preco_unitario: number;
  produtos?: Produto;
}

export interface Receita {
  id: string;
  descricao: string;
  categoria: CategoriaReceita;
  valor: number;
  data: string;
  cliente_id: string | null;
  vendedor_id: string | null;
  encomenda_id: string | null;
  forma_pagamento: string | null;
  created_at: string;
  clientes?: Cliente;
  vendedores?: Vendedor;
}

export interface Custo {
  id: string;
  descricao: string;
  categoria: CategoriaCusto;
  valor: number;
  data: string;
  vendedor_id: string | null;
  encomenda_id: string | null;
  gerado_automaticamente: boolean;
  created_at: string;
  vendedores?: Vendedor;
}
