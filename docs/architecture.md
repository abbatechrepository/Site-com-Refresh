# Arquitetura alvo

## Apps

- `portal`: experiencia publica, paginas institucionais, noticias, documentos, SEO e consumo da API.
- `refresh`: CMS administrativo, com autenticacao, autorizacao, workflow editorial e operacao de midia.
- `api`: dominio central com NestJS.

## Dominio preservado do legado

- `secao` -> `Section`
- `institucional` -> `Content`
- `mascara` -> `ContentType`
- `conteudo/template` -> `Template`
- `url_amigavel` -> `slug/path` + SEO/canonical
- `perfil/funcionarios/permissao` -> `Role/User/Permission`
- `emailmarketing/newsletter` -> `NewsletterCampaign/NewsletterGroup`

## Decisoes tecnicas

- Monorepo com workspaces.
- API com NestJS, Prisma e MySQL.
- Fronts com Next.js App Router.
- Tailwind substitui Bootstrap.
- Midia sai de `longblob` e vai para storage S3 compativel.
- Auditoria e privacidade sao parte do dominio.

## Estrutura apos refatoracao

- `apps/portal`: experiencia publica, consumo de contratos compartilhados e renderizacao do site.
- `apps/refresh`: CMS administrativo organizado por hooks, componentes e modulos por dominio.
- `apps/api`: dominio central com `management` separado em controller, service, DTOs, bootstrap, validacao e utilitarios.
- `packages/contracts`: contratos compartilhados entre API e frontends.
- `docs`: documentacao versionada do projeto e das decisoes de arquitetura.

Ver tambem: [Refatoracao 2026-04](</c:/Users/FELIPE/abbatech/refresh/docs/refactor-2026-04.md>).
