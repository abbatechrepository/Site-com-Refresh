FROM node:20-alpine AS base
WORKDIR /app
COPY package.json tsconfig.base.json ./
COPY package-lock.json ./
COPY packages/contracts/package.json ./packages/contracts/package.json
COPY apps/refresh/package.json ./apps/refresh/package.json
RUN npm install
COPY packages ./packages
COPY apps/refresh ./apps/refresh
RUN npm run build -w @abbatech/refresh

FROM node:20-alpine
WORKDIR /app
COPY --from=base /app /app
RUN mkdir -p apps/refresh/.next/standalone/apps/refresh/.next \
    && cp -r apps/refresh/.next/static apps/refresh/.next/standalone/apps/refresh/.next/static \
    && cp -r apps/refresh/public apps/refresh/.next/standalone/apps/refresh/public
EXPOSE 3000
CMD ["sh", "-c", "cd apps/refresh && HOSTNAME=0.0.0.0 PORT=3000 node .next/standalone/apps/refresh/server.js"]
