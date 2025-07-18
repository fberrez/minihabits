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
# Copy all files including the public directory
COPY . .

# Define build arguments for environment variables
ARG VITE_API_BASE_URL
ARG VITE_CONTACT_EMAIL
ARG VITE_STRIPE_PRICE_MONTHLY_ID
ARG VITE_STRIPE_PRICE_YEARLY_ID
ARG VITE_STRIPE_PRICE_LIFETIME_ID

# Set environment variables for the build process
ENV NODE_ENV=production
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_CONTACT_EMAIL=${VITE_CONTACT_EMAIL}
ENV VITE_STRIPE_PRICE_MONTHLY_ID=${VITE_STRIPE_PRICE_MONTHLY_ID}
ENV VITE_STRIPE_PRICE_YEARLY_ID=${VITE_STRIPE_PRICE_YEARLY_ID}
ENV VITE_STRIPE_PRICE_LIFETIME_ID=${VITE_STRIPE_PRICE_LIFETIME_ID}

# Build the application with environment variables
RUN pnpm nx build frontend

FROM node:20-alpine AS prod

ENV NODE_ENV=production

WORKDIR /app
# Copy the built files
COPY --from=build /app/dist/apps/frontend ./dist
# Install serve to host the static files
RUN npm install -g serve
# Expose port 80
EXPOSE 80
# Command to serve static files with proper SPA routing
CMD ["serve", "-s", "dist", "-l", "80"] 