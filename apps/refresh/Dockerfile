FROM node:20-alpine AS base
WORKDIR /app

COPY package.json package-lock.json tsconfig.base.json ./
COPY packages/contracts/package.json ./packages/contracts/package.json
COPY apps/refresh/package.json ./apps/refresh/package.json

RUN npm ci

COPY packages ./packages
COPY apps/refresh ./apps/refresh

RUN npm run build -w @abbatech/refresh

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

COPY --from=base /app/apps/refresh/.next/standalone ./
COPY --from=base /app/apps/refresh/.next/static ./apps/refresh/.next/static
COPY --from=base /app/apps/refresh/public ./apps/refresh/public

EXPOSE 3000

CMD ["node", "apps/refresh/server.js"]
