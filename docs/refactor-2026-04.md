# Refatoracao 2026-04

## Objetivo

Esta refatoracao consolidou o monorepo em uma base mais profissional, com foco em:

- separacao de responsabilidades
- reducao de arquivos gigantes
- contratos compartilhados entre apps
- validacao automatizada continua
- padronizacao operacional e de documentacao

## Resumo do que mudou

### Qualidade e automacao

- Foi criada uma esteira minima de qualidade no monorepo.
- O projeto agora possui `typecheck`, `lint`, `test`, `test:watch` e `check` no `package.json`.
- Foi adicionado `eslint.config.mjs` na raiz do repositorio.
- Foi adicionado `vitest.config.ts` na raiz do repositorio.
- Foi criado workflow de CI em `docs/../.github/workflows/ci.yml`.
- O `docs/` deixou de ser ignorado no Git.
- Artefatos gerados como `apps/api/dist` foram removidos do versionamento ativo.

### Padronizacao operacional

- As portas de desenvolvimento dos apps foram alinhadas:
- `apps/portal` passou a usar `3100`
- `apps/refresh` passou a usar `3101`
- O README foi atualizado para refletir o fluxo real de setup e os comandos de qualidade.

### Contratos compartilhados

- O pacote `@abbatech/contracts` deixou de ser apenas um placeholder.
- Foram adicionados contratos reais em:
- `packages/contracts/src/common.ts`
- `packages/contracts/src/auth.ts`
- `packages/contracts/src/sections.ts`
- `packages/contracts/src/contents.ts`
- `packages/contracts/src/index.ts` passou a exportar os contratos de dominio.
- O portal passou a consumir contratos compartilhados em `apps/portal/lib/api.ts`.

## Refatoracao do `apps/refresh`

### Problema original

O `refresh` concentrava grande parte da interface administrativa em arquivos com milhares de linhas, misturando:

- estado de tela
- efeitos
- chamadas de API
- regras derivadas
- renderizacao de modulos
- componentes reutilizaveis

### Resultado

O entrypoint da pagina foi reduzido e a tela passou a ser organizada por composicao.

Arquivos principais:

- `apps/refresh/app/page.tsx`
- `apps/refresh/app/RefreshPageClient.tsx`

### Separacao por responsabilidade

Biblioteca e regras puras:

- `apps/refresh/app/_lib/api.ts`
- `apps/refresh/app/_lib/constants.ts`
- `apps/refresh/app/_lib/types.ts`
- `apps/refresh/app/_lib/utils.ts`

Hooks do manager:

- `apps/refresh/app/_hooks/useRefreshManager.ts`
- `apps/refresh/app/_hooks/useRefreshManagerState.ts`
- `apps/refresh/app/_hooks/useRefreshManagerDerived.ts`
- `apps/refresh/app/_hooks/useRefreshManagerSession.ts`
- `apps/refresh/app/_hooks/useRefreshManagerEditors.ts`
- `apps/refresh/app/_hooks/useRefreshManagerMutations.ts`

Componentes compartilhados:

- `apps/refresh/app/_components/ActionButton.tsx`
- `apps/refresh/app/_components/RefreshLogin.tsx`
- `apps/refresh/app/_components/RefreshShell.tsx`
- `apps/refresh/app/_components/SectionTree.tsx`

Renderizacao de modulos por dominio:

- `apps/refresh/app/_components/RefreshModules.tsx`
- `apps/refresh/app/_components/modules/ContentModules.tsx`
- `apps/refresh/app/_components/modules/DesignModules.tsx`
- `apps/refresh/app/_components/modules/AccessModules.tsx`
- `apps/refresh/app/_components/modules/UserModules.tsx`
- `apps/refresh/app/_components/modules/SystemModules.tsx`
- `apps/refresh/app/_components/modules/moduleTypes.ts`

### Efeito pratico

- `page.tsx` deixou de ser um arquivo gigante
- o manager foi quebrado por escopo funcional
- hooks passaram a agrupar comportamento por tipo de responsabilidade
- modulos visuais deixaram de ficar centralizados em um unico renderizador monolitico

## Refatoracao do `apps/api`

### Problema original

O modulo `management` concentrava validacoes, DTOs, bootstrap administrativo, operacoes CRUD e regras utilitarias em arquivos extensos demais.

### Resultado

O modulo foi repartido por funcao:

- `apps/api/src/modules/management/management.controller.ts`
- `apps/api/src/modules/management/management.service.ts`
- `apps/api/src/modules/management/management.dto.ts`
- `apps/api/src/modules/management/management.validation.service.ts`
- `apps/api/src/modules/management/management.bootstrap.ts`
- `apps/api/src/modules/management/management.types.ts`
- `apps/api/src/modules/management/management.utils.ts`

### O que foi separado

- DTOs de entrada sairam do controller
- validacoes de unicidade e consistencia sairam do service principal
- a montagem do payload de `bootstrap` saiu do service principal
- utilitarios de `slug` e normalizacao de CPF sairam do service principal
- o `nextReferenceNumberFor` deixou de usar acesso generico com `any`

### Seed do Prisma

O seed tambem deixou de concentrar tudo em um arquivo unico.

Arquivos criados:

- `apps/api/prisma/seed.ts`
- `apps/api/prisma/seed/access.data.ts`
- `apps/api/prisma/seed/content.data.ts`
- `apps/api/prisma/seed/newsletter.data.ts`
- `apps/api/prisma/seed/system.data.ts`
- `apps/api/prisma/seed/types.ts`

O `seed.ts` passou a atuar como orquestrador e os dados ficaram separados por dominio.

### Ajuste de TypeScript na API

- O `apps/api/tsconfig.json` passou a incluir `prisma/**/*.ts`.
- Isso evita diagnosticos inconsistentes do editor em `seed.ts` e garante que o arquivo seja validado pelo mesmo projeto TypeScript da API.

## Refatoracao do `apps/portal`

### O que mudou

- O portal passou a consumir contratos do pacote compartilhado.
- Foi corrigida a pagina de detalhe `apps/portal/app/[slug]/page.tsx` para evitar problema de lint relacionado a JSX dentro de `try/catch`.
- O `typecheck` e o `lint` do portal passaram a fazer parte da esteira da raiz.

## Testes adicionados

Foram adicionados testes iniciais para estabelecer uma base automatizada:

- `apps/refresh/app/_lib/utils.test.ts`
- `apps/portal/lib/api.test.ts`

O objetivo desta primeira leva nao foi cobrir todo o dominio, mas garantir:

- validacao automatizada minima
- ponto de partida para expansao de cobertura
- compatibilidade com CI

## Validacoes executadas durante o refactor

Ao longo da refatoracao, as alteracoes foram conferidas com:

- `npm run typecheck`
- `npm run lint`
- `npm run test`

Tambem foram executadas validacoes pontuais em workspaces especificos, principalmente na API.

## Estado esperado apos a refatoracao

Ao final desta rodada, o estado esperado do projeto e:

- `typecheck` passando na raiz
- `lint` passando na raiz
- `test` passando na raiz
- arquivos-fonte sem concentrar milhares de linhas em um unico ponto
- `docs/` versionado normalmente

## Pendencias que nao fizeram parte desta rodada

Os itens abaixo continuam como melhorias futuras, nao como regressao:

- aumentar cobertura de testes da API
- criar testes E2E dos fluxos principais
- expandir mais o uso de contratos compartilhados
- introduzir uma camada adicional de features no portal, se o escopo crescer
- revisar estrategia de cache e revalidate do portal conforme necessidade de produto

## Convencoes de manutencao daqui para frente

- Evitar arquivos monoliticos com centenas ou milhares de linhas quando houver mais de uma responsabilidade clara.
- Extrair DTOs, utilitarios e validacoes para arquivos proprios ao crescerem.
- No frontend, separar estado, dados derivados, efeitos e renderizacao por escopo.
- Preferir contratos compartilhados em `packages/contracts` quando API e front precisarem falar a mesma lingua.
- Antes de fechar qualquer refactor grande, rodar `npm run check`.
