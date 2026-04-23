# Abbatech

Reconstrucao do legado em nova stack com:

- `portal`: site publico em Next.js
- `refresh`: CMS em Next.js
- `api`: backend em NestJS
- `mysql`: persistencia principal
- `minio`: storage de arquivos
- `mailpit`: ambiente local para emails

## Principios aplicados

- TypeScript em toda a stack
- Tailwind CSS no front
- Separacao explicita entre portal, CMS e API
- Controles iniciais de seguranca: `helmet`, CORS restrito, validacao global, rate limit, JWT, auditoria
- Base de LGPD: consentimento, politica de retencao, trilha de auditoria, minimizacao de dados e segregacao de midia

## Estrutura

```text
abbatech/
  apps/
    api/
    portal/
    refresh/
  packages/
    contracts/
  docker-compose.yml
  docker-compose.prod.yml
  dokploy.yaml
```

## Subida local

```bash
cp .env.example .env
npm install
docker compose up --build
```

Servicos:

- Portal: `http://localhost:3100`
- Refresh CMS: `http://localhost:3101`
- API: `http://localhost:3333/api/v1`
- Mailpit: `http://localhost:8025`
- MinIO Console: `http://localhost:9001`

## Acesso inicial do MVP

- Refresh CMS: `http://localhost:3101`
- E-mail inicial: `admin@abbatech.local`
- Senha inicial: `Refresh123!`

Ao subir o ambiente, a API aplica as migrations e executa o seed inicial automaticamente.

## Qualidade

```bash
npm run typecheck
npm run lint
npm run test
npm run check
```

O repositório possui esteira local e CI para `typecheck`, lint, testes e build.

## Escopo desta primeira reconstrucao

- Monorepo pronto para evolucao
- API modular baseada no dominio legado
- Portal e CMS com App Router e Tailwind
- Schema inicial que preserva a logica conceitual de secoes, conteudos, templates, SEO, usuarios, papeis, newsletter e auditoria
- Infra local e produtiva com Docker Compose e artefato de Dokploy

## Observacoes

- O codigo legado continua sendo a fonte funcional de referencia.
- O schema novo preserva a estrutura conceitual, mas nao replica cegamente tecnicas antigas como `seq`, `longblob` para imagens e templates HTML executados sem controle.
