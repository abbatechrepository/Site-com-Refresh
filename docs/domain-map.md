# Mapa de dominio

## Equivalencias de nomenclatura

| Termo de negocio | Dominio atual | Observacao |
| --- | --- | --- |
| `secao` | `Section` | arvore de navegacao e organizacao editorial |
| `institucional` | `Content` | conteudo editorial principal |
| `mascara` | `ContentType` | tipo editorial com schema JSON |
| `conteudo` | `Template` e regras de listagem | define apresentacao e configuracao de renderizacao |
| `perfil`, `funcionarios`, `permissao_*` | `Role`, `User`, `Permission` | modelo RBAC |
| `url_amigavel` | `slug`, `path`, `SeoMetadata` | URLs, canonical e governanca SEO |
| `emailmarketing`, `newsletter` | `NewsletterCampaign`, `NewsletterGroup`, `NewsletterRecipient` | campanhas e consentimento rastreavel |
| `log` | `AuditLog` | trilha de auditoria estruturada |

## Elementos centrais do produto

- taxonomia de secoes
- tipos de conteudo e comportamentos editoriais
- fluxo de publicacao e permissao
- URLs amigaveis
- SEO, auditoria e relacionamento entre secoes e conteudos
- campanhas e grupos de newsletter

## Diretrizes de implementacao

- Evitar HTML salvo em banco como engine final de renderizacao.
- Evitar blobs de imagem no banco quando houver storage dedicado.
- Evitar geracao manual de IDs orientada por sequencias de aplicacao.
- Evitar SQL acoplado diretamente a views.
- Manter responsabilidades de dominio e apresentacao separadas.

## Observacao

O estado atual da estrutura do monorepo esta documentado em [Refatoracao 2026-04](</c:/Users/FELIPE/abbatech/refresh/docs/refactor-2026-04.md>).
