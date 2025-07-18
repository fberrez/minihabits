FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g corepack@latest
RUN corepack enable

FROM base AS build
WORKDIR /app
COPY pnpm-lock.yaml package.json ./
COPY nx.json ./
# Install ALL dependencies (including devDependencies)
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm nx build backend

FROM base AS prod
WORKDIR /app
COPY pnpm-lock.yaml package.json ./
# Install ONLY production dependencies
RUN pnpm install --frozen-lockfile --prod
COPY --from=build /app/dist/apps/backend ./dist

EXPOSE 3000
CMD [ "node", "dist/main" ] 