# syntax=docker/dockerfile:1.7

# ─────────────────────────────────────────────────────────────
# Habitactive · imagen de producción
# Next.js 14 + Prisma + PostgreSQL
# ─────────────────────────────────────────────────────────────

FROM node:22-bookworm-slim AS base
ENV NEXT_TELEMETRY_DISABLED=1
ENV NPM_CONFIG_UPDATE_NOTIFIER=false
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# ── Dependencias ────────────────────────────────────────────
FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci --no-audit --no-fund

# ── Build ───────────────────────────────────────────────────
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Valores sólo de build: el runtime recibe los reales.
ENV DATABASE_URL="postgresql://build:build@127.0.0.1:5432/build?schema=public"
ENV NEXTAUTH_SECRET="build-only-placeholder-not-used-at-runtime"
ENV NEXTAUTH_URL="http://localhost:3000"
RUN npm run build

# ── Runtime ─────────────────────────────────────────────────
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

COPY package.json package-lock.json ./
COPY prisma ./prisma
# Prisma CLI está en dependencies para poder ejecutar `migrate deploy`
# al arrancar el contenedor. El postinstall genera el cliente.
RUN npm ci --omit=dev --no-audit --no-fund \
  && npm cache clean --force

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=45s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["sh", "-c", "npx --no-install prisma migrate deploy && npm run start"]
