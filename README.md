# DuoCrochê — Controle de Receitas e Custos

Aplicação web para gestão financeira e operacional da DuoCrochê: receitas,
custos, encomendas, estoque e um dashboard geral com o lucro líquido
calculado automaticamente. Construída em Next.js + Supabase, pensada para
ser acessada pelos sócios de qualquer lugar.

## Rodando localmente (modo demonstração)

Sem nenhuma configuração adicional, a aplicação já roda com dados de
exemplo em memória — ótimo para conhecer as telas antes de conectar o
banco de dados real.

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). Na tela de login,
basta clicar em "Entrar (demonstração)". Os dados de exemplo são
reiniciados sempre que o servidor de desenvolvimento reinicia — nada é
salvo de verdade nesse modo.

## Colocando os dados de verdade (Supabase)

A aplicação usa o [Supabase](https://supabase.com) como banco de dados
(Postgres) e sistema de login. O plano gratuito é suficiente para o
tamanho da DuoCrochê.

1. **Crie uma conta e um projeto** em [supabase.com](https://supabase.com)
   (você mesmo precisa criar a conta — é gratuita).
2. No painel do projeto, abra **SQL Editor**, cole todo o conteúdo do
   arquivo [`supabase/schema.sql`](supabase/schema.sql) deste projeto e
   execute. Isso cria todas as tabelas (produtos, clientes, vendedores,
   sócios, encomendas, receitas, custos, estoque) já com as permissões de
   acesso configuradas.
3. Em **Project Settings > API**, copie a **Project URL** e a chave
   **anon public**.
4. Copie o arquivo `.env.local.example` para `.env.local` e cole esses
   dois valores:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-publica
   ```
5. Reinicie `npm run dev`. A partir daqui a aplicação já está gravando e
   lendo do Supabase de verdade, e o banner de "modo demonstração" some.

### Criando o login de cada sócio/vendedor

Como cada pessoa tem login individual, quem administra o projeto cria os
acessos pelo painel do Supabase (**Authentication > Users > Add user**):

1. Cadastre o e-mail e uma senha provisória para a pessoa.
2. Um registro é criado automaticamente na tabela `profiles` com papel
   `socio` por padrão. Se quiser marcar alguém como `admin` ou
   `vendedor`, edite a coluna `papel` dessa pessoa direto na tabela
   `profiles` (**Table Editor > profiles**).
3. Avise a pessoa do e-mail e senha para o primeiro acesso (ela pode
   trocar a senha depois pelo próprio painel do Supabase, a pedido do
   administrador).

Depois disso, cadastre também os **Sócios** e **Vendedores** dentro da
própria aplicação (menu Cadastros) — são registros de negócio
(comissão, participação societária etc.), independentes do login.

## Publicando para os sócios acessarem de fora (Vercel)

1. Suba este projeto para um repositório no GitHub (crie o repositório
   você mesmo e faça o push).
2. Crie uma conta em [vercel.com](https://vercel.com) e clique em
   **Add New > Project**, escolhendo esse repositório.
3. Em **Environment Variables**, adicione as mesmas duas variáveis do
   `.env.local` (`NEXT_PUBLIC_SUPABASE_URL` e
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
4. Clique em **Deploy**. Em poucos minutos a Vercel gera um link público
   (algo como `duocroche.vercel.app`) que qualquer sócio pode acessar de
   qualquer lugar, bastando fazer login com o e-mail/senha cadastrados.

A partir daí, todo novo `git push` na branch principal atualiza o site
publicado automaticamente.

## Como o automatizado funciona

- **Dashboard Geral**: soma todas as receitas e custos e mostra o lucro
  líquido (receitas − custos), com gráfico dos últimos 6 meses e lista de
  encomendas com entrega atrasada.
- **Encomendas**: ao mudar o status de uma encomenda para "Entregue", o
  sistema gera automaticamente a receita correspondente e, se o vendedor
  tiver comissão configurada, gera também o custo de comissão — sem
  lançamento manual duplicado.
- **Estoque**: cadastro simples de quantidade por produto (sem alertas
  automáticos, conforme definido para este projeto).

## Estrutura do projeto

- `supabase/schema.sql` — script único com todas as tabelas e permissões.
- `src/lib/data/` — acesso ao banco de dados (uma função por entidade).
- `src/lib/actions/` — ações de formulário (criar/editar/excluir).
- `src/app/(app)/` — todas as telas autenticadas (Dashboard, Receitas,
  Custos, Encomendas, Estoque, Cadastros).
- `src/lib/demo-store.ts` — dados de exemplo usados apenas quando o
  Supabase não está configurado.
