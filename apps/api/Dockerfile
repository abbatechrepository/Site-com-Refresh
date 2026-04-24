FROM node:20-slim AS base
WORKDIR /app
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
COPY package.json tsconfig.base.json ./
COPY package-lock.json ./
COPY packages/contracts/package.json ./packages/contracts/package.json
COPY apps/api/package.json ./apps/api/package.json
RUN npm install
COPY packages ./packages
COPY apps/api ./apps/api
RUN npm run build -w @abbatech/api

FROM node:20-slim
WORKDIR /app
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
COPY --from=base /app /app
EXPOSE 3333
CMD ["sh", "-c", "npm run prisma:generate -w @abbatech/api && until npm run prisma:migrate -w @abbatech/api; do echo 'Aguardando MySQL...'; sleep 5; done; node apps/api/dist/src/main.js"]
