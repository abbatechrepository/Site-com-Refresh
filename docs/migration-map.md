# Mapa de migracao

## Equivalencias principais

| Legado | Novo dominio | Observacao |
| --- | --- | --- |
| `Manager/` | `apps/refresh` | troca UI procedural por React App Router |
| `home`, `conteudo`, `portal`, `busca` | `apps/portal` | portal desacoplado da logica de edicao |
| `conexao.php`, `ado.php` | `apps/api` | acesso a dados centralizado na API |
| `institucional` | `Content` | conteudo editorial principal |
| `secao` | `Section` | arvore de navegacao |
| `mascara` | `ContentType` | tipo editorial com schema JSON |
| `conteudo` | `Template` e regras de listagem | remove HTML acoplado como runtime inseguro |
| `perfil`, `funcionarios`, `permissao_*` | `Role`, `User`, `Permission` | RBAC moderno |
| `url_amigavel` | `slug`, `path`, `SeoMetadata` | URLs e canonical governados pela API |
| `emailmarketing`, `newsletter` | `NewsletterCampaign`, `NewsletterGroup`, `NewsletterRecipient` | campanhas e consentimento rastreavel |
| `log` | `AuditLog` | trilha de auditoria estruturada |

## O que preservar

- taxonomia de secoes
- tipos de conteudo e comportamentos editoriais
- fluxo de publicacao e permissao
- URLs amigaveis
- preocupacao com newsletter, SEO, auditoria e relacionamento entre secoes e conteudos

## O que nao portar literalmente

- HTML salvo em banco como engine final de renderizacao
- blobs de imagem no banco
- `seq` como geracao manual de IDs
- SQL acoplado a view
- jQuery e Bootstrap legado

## Observacao

O estado atual da refatoracao estrutural do monorepo esta documentado em [Refatoracao 2026-04](</c:/Users/FELIPE/abbatech/refresh/docs/refactor-2026-04.md>).
