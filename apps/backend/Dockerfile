FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g corepack@latest
RUN corepack enable

FROM base AS build
WORKDIR /app
# Copy workspace configuration files (only what's needed for backend)
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY turbo.json ./
# Copy only backend package.json
COPY apps/backend/package.json ./apps/backend/
# Install build tools needed for native dependencies like bcryptjs
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*
# Install dependencies for backend only
RUN pnpm install --filter=minihabits-backend --frozen-lockfile
# Copy backend source files only
COPY apps/backend/ ./apps/backend/
# Build backend
RUN pnpm run build:backend

FROM base AS prod
WORKDIR /app
# Install build tools needed for native dependencies like bcryptjs
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*
# Copy workspace files for proper dependency resolution
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/
# Install production dependencies for backend only
RUN pnpm install --filter=minihabits-backend --frozen-lockfile --prod

COPY --from=build /app/apps/backend/dist ./dist

# Set NODE_PATH to help Node.js find modules in PNPM structure
ENV NODE_PATH=/app/node_modules/.pnpm/node_modules:/app/apps/backend/node_modules

EXPOSE 3000
CMD [ "node", "dist/main" ] 