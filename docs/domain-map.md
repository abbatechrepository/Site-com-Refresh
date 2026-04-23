# Domínio da Plataforma

## Núcleos funcionais

### Estrutura editorial

- `Section`: organiza a navegação e a hierarquia de áreas do portal.
- `ContentType`: define formatos editoriais e schema dos conteúdos.
- `Template`: determina a apresentação e o comportamento visual das páginas.
- `Content`: representa publicações, páginas e materiais editoriais.

### Acesso e operação

- `User`: representa contas de operação da plataforma.
- `Role`: organiza perfis de acesso e escopo operacional.
- `Permission`: define capacidades e autorizações.
- `RoleApplicationAccess`: controla acesso a áreas funcionais da plataforma.

### Comunicação e governança

- `SeoMetadata`: centraliza metadados de indexação e canonical.
- `NewsletterCampaign`, `NewsletterGroup` e `NewsletterRecipient`: estruturam comunicação editorial e relacionamento.
- `AuditLog`: mantém rastreabilidade operacional.
- `PrivacyRequest`: apoia fluxo de atendimento e governança de privacidade.

## Diretrizes de implementação

- Separar domínio, apresentação e infraestrutura.
- Centralizar contratos compartilhados entre API e frontends.
- Priorizar storage dedicado para arquivos e mídia.
- Evitar acoplamento de regras de negócio à camada de visualização.
- Manter URLs, SEO e permissões governados pela API.