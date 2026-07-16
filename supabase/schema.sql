-- =========================================================================
-- DuoCrochê — Schema do banco de dados (Supabase / Postgres)
-- Execute este arquivo inteiro no SQL Editor do seu projeto Supabase.
-- =========================================================================

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------
-- PROFILES — estende auth.users com nome/papel de cada pessoa que loga
-- ---------------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  email text not null,
  papel text not null default 'socio' check (papel in ('admin', 'socio', 'vendedor')),
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

-- Cria automaticamente um profile quando um novo usuário é criado no Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nome, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'nome', new.email), new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------
-- SÓCIOS
-- ---------------------------------------------------------------------
create table if not exists socios (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references profiles(id) on delete set null,
  nome text not null,
  percentual_participacao numeric(5,2),
  telefone text,
  email text,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- VENDEDORES
-- ---------------------------------------------------------------------
create table if not exists vendedores (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references profiles(id) on delete set null,
  nome text not null,
  telefone text,
  email text,
  tipo_comissao text not null default 'percentual' check (tipo_comissao in ('percentual', 'fixo', 'nenhuma')),
  valor_comissao numeric(10,2) not null default 0,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- CLIENTES
-- ---------------------------------------------------------------------
create table if not exists clientes (
  id uuid primary key default uuid_generate_v4(),
  nome text not null,
  telefone text,
  email text,
  endereco text,
  observacoes text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- PRODUTOS
-- ---------------------------------------------------------------------
create table if not exists produtos (
  id uuid primary key default uuid_generate_v4(),
  nome text not null,
  categoria text,
  preco_venda numeric(10,2) not null default 0,
  custo_producao numeric(10,2) not null default 0,
  descricao text,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- ESTOQUE — cadastro simples de quantidade por produto
-- ---------------------------------------------------------------------
create table if not exists estoque (
  id uuid primary key default uuid_generate_v4(),
  produto_id uuid not null references produtos(id) on delete cascade,
  quantidade integer not null default 0,
  atualizado_em timestamptz not null default now(),
  unique (produto_id)
);

-- ---------------------------------------------------------------------
-- ENCOMENDAS
-- ---------------------------------------------------------------------
create table if not exists encomendas (
  id uuid primary key default uuid_generate_v4(),
  cliente_id uuid references clientes(id) on delete set null,
  vendedor_id uuid references vendedores(id) on delete set null,
  data_pedido date not null default current_date,
  data_entrega_prevista date,
  data_entrega_real date,
  status text not null default 'pendente' check (status in ('pendente', 'em_producao', 'pronto', 'entregue', 'cancelado')),
  valor_total numeric(10,2) not null default 0,
  observacoes text,
  created_at timestamptz not null default now()
);

create table if not exists encomenda_itens (
  id uuid primary key default uuid_generate_v4(),
  encomenda_id uuid not null references encomendas(id) on delete cascade,
  produto_id uuid references produtos(id) on delete set null,
  quantidade integer not null default 1,
  preco_unitario numeric(10,2) not null default 0
);

-- ---------------------------------------------------------------------
-- RECEITAS
-- ---------------------------------------------------------------------
create table if not exists receitas (
  id uuid primary key default uuid_generate_v4(),
  descricao text not null,
  categoria text not null default 'venda' check (categoria in ('venda', 'encomenda', 'outra')),
  valor numeric(10,2) not null,
  data date not null default current_date,
  cliente_id uuid references clientes(id) on delete set null,
  vendedor_id uuid references vendedores(id) on delete set null,
  encomenda_id uuid references encomendas(id) on delete set null,
  forma_pagamento text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- CUSTOS
-- ---------------------------------------------------------------------
create table if not exists custos (
  id uuid primary key default uuid_generate_v4(),
  descricao text not null,
  categoria text not null default 'outros' check (categoria in ('materia_prima', 'comissao', 'embalagem', 'marketing', 'operacional', 'outros')),
  valor numeric(10,2) not null,
  data date not null default current_date,
  vendedor_id uuid references vendedores(id) on delete set null,
  encomenda_id uuid references encomendas(id) on delete set null,
  gerado_automaticamente boolean not null default false,
  created_at timestamptz not null default now()
);

-- =========================================================================
-- ROW LEVEL SECURITY
-- Time pequeno e de confiança: qualquer pessoa autenticada (sócio ou
-- vendedor com login) pode ler e escrever em todas as tabelas de negócio.
-- Apenas o próprio usuário edita seu profile.
-- =========================================================================
alter table profiles enable row level security;
alter table socios enable row level security;
alter table vendedores enable row level security;
alter table clientes enable row level security;
alter table produtos enable row level security;
alter table estoque enable row level security;
alter table encomendas enable row level security;
alter table encomenda_itens enable row level security;
alter table receitas enable row level security;
alter table custos enable row level security;

create policy "profiles: leitura por autenticados" on profiles for select using (auth.role() = 'authenticated');
create policy "profiles: cada um edita o proprio" on profiles for update using (auth.uid() = id);

do $$
declare
  t text;
begin
  for t in select unnest(array['socios','vendedores','clientes','produtos','estoque','encomendas','encomenda_itens','receitas','custos'])
  loop
    execute format('create policy "%1$s: acesso total autenticados" on %1$s for all using (auth.role() = ''authenticated'') with check (auth.role() = ''authenticated'')', t);
  end loop;
end $$;
