FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g corepack@latest
RUN corepack enable

FROM base AS build
WORKDIR /app
# Copy workspace configuration files (only what's needed for frontend)
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY turbo.json ./
# Copy only frontend package.json
COPY apps/frontend/package.json ./apps/frontend/
# Install dependencies for frontend only
RUN pnpm install --filter=minihabits-frontend --frozen-lockfile
# Copy frontend source files only
COPY apps/frontend/ ./apps/frontend/

# Define build arguments for environment variables (with defaults for development)
ARG VITE_API_BASE_URL=http://localhost:3000
ARG VITE_CONTACT_EMAIL=contact@example.com

# Set environment variables for the build process
ENV NODE_ENV=production
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_CONTACT_EMAIL=${VITE_CONTACT_EMAIL}

# Build the application with environment variables
RUN pnpm run build:frontend

FROM node:20-alpine AS prod

ENV NODE_ENV=production

WORKDIR /app
# Copy the built files
COPY --from=build /app/apps/frontend/dist ./dist
# Install serve to host the static files
RUN npm install -g serve
# Expose port 80
EXPOSE 80
# Command to serve static files with proper SPA routing
CMD ["serve", "-s", "dist", "-l", "80"] 