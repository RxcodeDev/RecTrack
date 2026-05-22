# syntax=docker/dockerfile:1
# =============================================================================
# RecTrack — imagen de producción (Next.js 16, output "standalone")
# Build multi-stage: deps → builder → runner
# =============================================================================

# ── Stage 1: dependencias ────────────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ── Stage 2: build ───────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# ADMIN_PASSWORD / ADMIN_SECRET solo se necesitan en runtime, no en el build.
RUN npm run build

# ── Stage 3: runtime ─────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Usuario sin privilegios
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Servidor autónomo de Next.js (server.js + node_modules mínimos)
COPY --from=builder /app/.next/standalone ./
# Assets estáticos generados por el build (no incluidos en standalone)
COPY --from=builder /app/.next/static ./.next/static
# Estáticos públicos: imágenes, logos y semilla de uploads/
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# CMS de archivos planos: semilla de los JSON de contenido
COPY --from=builder --chown=nextjs:nodejs /app/data ./data

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
