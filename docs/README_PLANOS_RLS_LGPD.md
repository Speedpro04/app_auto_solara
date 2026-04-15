# Implementacao: Planos, Limite de Especialistas, JWT + RLS + LGPD

## Arquivo SQL
- `C:\apis_solara_ADM\sql\2026-04-15_plans_rls_lgpd.sql`

## O que este script cria
1. Estrutura multi-tenant:
   - `app.tenants`
   - `app.tenant_users`
2. Planos e assinatura:
   - `app.plan_catalog` (com seed dos planos 2/5/10 especialistas)
   - `app.tenant_subscriptions`
3. Especialistas e LGPD:
   - `app.specialists`
   - `app.lgpd_requests`
   - `app.anonymize_specialist(uuid)`
4. Seguranca:
   - RLS habilitado em todas as tabelas
   - Policies por tenant com `auth.uid()`
   - Funcoes com JWT (`app.jwt_tenant_id()`)
5. Regra de negocio critica:
   - Trigger `app.enforce_specialist_limit()` bloqueia insert/update quando passar do limite do plano.

## Como aplicar no Supabase
1. Abra o SQL Editor do projeto.
2. Cole o conteudo de `2026-04-15_plans_rls_lgpd.sql`.
3. Execute com role administrativa (SQL Editor ja executa com privilegio suficiente).

## Como testar o bloqueio de limite
1. Crie um tenant em `app.tenants`.
2. Vincule um usuario owner/admin em `app.tenant_users`.
3. Crie uma assinatura ativa em `app.tenant_subscriptions` com plano `essential` (limite 2).
4. Insira 2 especialistas ativos em `app.specialists` (ok).
5. Tente inserir o 3o especialista ativo (deve falhar com erro de limite do plano).

## JWT e RLS (tenant_id claim)
- O script usa `auth.uid()` para validar membro/admin do tenant.
- Opcionalmente, ele reforca `tenant_id` via claim JWT (`app.jwt_tenant_id()`) para insert/update/delete de especialistas.
- Recomendo incluir `tenant_id` no JWT do usuario autenticado (custom claim), mantendo coerencia com o tenant selecionado no app.

## LGPD - pontos aplicados
- Minimizacao: nao armazena documento bruto, apenas hash (`document_hash`).
- Rastreabilidade: tabela `app.lgpd_requests` para solicitacoes do titular.
- Direito de eliminacao/anominizacao: funcao `app.anonymize_specialist`.
- Isolamento de dados por tenant via RLS.

## Observacao importante
- Use `C:\apis_solara_ADM\.env.example` como modelo e mantenha credenciais reais apenas no `.env` local (ignorado pelo git).
- Nunca exponha chaves no frontend. Em apps web, evite prefixos publicos para qualquer segredo.
