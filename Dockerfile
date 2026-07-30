FROM node:20-alpine AS base
WORKDIR /app

RUN apk add --no-cache python3 make g++ sqlite-dev build-base

FROM base AS deps
COPY package*.json ./
RUN npm ci

FROM deps AS builder
COPY . .

RUN npx prisma generate
RUN npm run build
RUN npm prune --production

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

RUN apk add --no-cache sqlite

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./dist/public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/package.json ./package.json

RUN mkdir -p /app/prisma/data && chown -R nodejs:nodejs /app/prisma

USER nodejs

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/server.js"]
