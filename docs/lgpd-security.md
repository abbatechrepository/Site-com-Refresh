# Seguranca e LGPD

## Seguranca

- `helmet` ativado na API
- CORS restrito por variavel de ambiente
- `ValidationPipe` com `whitelist` e `forbidNonWhitelisted`
- JWT para autenticacao
- `Throttler` para reducao de abuso
- segregacao entre portal, CMS e API
- storage externo para arquivos em vez de blob no banco

## LGPD

- entidade de `PrivacyRequest` para atendimento ao titular
- `consentAt` e `consentVersion` em usuarios e destinatarios de newsletter
- `lgpdRetentionUntil` para conteudos sensiveis quando aplicavel
- `lgpdRestricted` em midias
- `AuditLog` para rastreabilidade
- principio de minimizacao no schema inicial

## Recomendacoes para producao

- trocar todos os segredos do `.env`
- habilitar TLS no proxy do Dokploy
- armazenar backups criptografados
- usar antivirus e validacao MIME em upload
- adicionar SSO ou MFA para o Refresh
- revisar base legal por modulo antes do go-live

