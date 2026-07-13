# ── Stage 1: Build ──────────────────────────────────────────────────
FROM node:22-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace manifests first (for layer caching)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.base.json ./

# Copy all package.json files for workspace resolution
COPY lib/db/package.json            ./lib/db/
COPY lib/api-zod/package.json       ./lib/api-zod/
COPY backend/api-server/package.json ./backend/api-server/

# Install all workspace dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY lib/       ./lib/
COPY backend/   ./backend/

# Build the backend (esbuild bundles everything into dist/index.mjs)
RUN pnpm --filter @workspace/api-server run build

# ── Stage 2: Runtime ─────────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

# Only copy the bundled output — no node_modules needed (esbuild bundles deps)
COPY --from=builder /app/backend/api-server/dist ./dist

# Expose port (Koyeb sets PORT automatically)
EXPOSE 8000

ENV NODE_ENV=production
ENV PORT=8000

CMD ["node", "--enable-source-maps", "./dist/index.mjs"]
