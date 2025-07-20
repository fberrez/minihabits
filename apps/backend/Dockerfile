FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g corepack@latest
RUN corepack enable

FROM base AS build
WORKDIR /app
# Copy workspace configuration files
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY nx.json ./
# Copy all app package.json files to ensure proper workspace dependency resolution
COPY apps/backend/package.json ./apps/backend/
COPY apps/frontend/package.json ./apps/frontend/
# Install build tools needed for native dependencies like bcrypt
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*
# Install ALL dependencies (including devDependencies)
RUN pnpm install --frozen-lockfile
# Copy all source files
COPY . .
RUN pnpm nx build backend

FROM base AS prod
WORKDIR /app
# Install build tools needed for native dependencies like bcrypt
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*
# Copy workspace files for proper dependency resolution
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/frontend/package.json ./apps/frontend/
# Install ALL dependencies (dev + prod) to ensure everything is available
RUN pnpm install --frozen-lockfile

COPY --from=build /app/apps/backend/dist ./dist

# Set NODE_PATH to help Node.js find modules in PNPM structure
ENV NODE_PATH=/app/node_modules/.pnpm/node_modules:/app/apps/backend/node_modules

EXPOSE 3000
CMD [ "node", "dist/main" ] 