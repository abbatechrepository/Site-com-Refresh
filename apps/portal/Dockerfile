FROM node:20-alpine AS base
WORKDIR /app

ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_REFRESH_URL
ARG NEXT_PUBLIC_API_URL

ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV NEXT_PUBLIC_REFRESH_URL=${NEXT_PUBLIC_REFRESH_URL}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

COPY package.json package-lock.json tsconfig.base.json ./
COPY packages/contracts/package.json ./packages/contracts/package.json
COPY apps/portal/package.json ./apps/portal/package.json

RUN npm ci

COPY packages ./packages
COPY apps/portal ./apps/portal

RUN npm run build -w @abbatech/portal

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

COPY --from=base /app/apps/portal/.next/standalone ./
COPY --from=base /app/apps/portal/.next/static ./apps/portal/.next/static

EXPOSE 3000

CMD ["node", "apps/portal/server.js"]
