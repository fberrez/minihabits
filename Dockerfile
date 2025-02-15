# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies and PNPM
RUN apk add --no-cache python3 make g++ \
    && npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install build dependencies and PNPM
RUN apk add --no-cache python3 make g++ \
    && npm install -g pnpm

# Copy all node_modules from builder to preserve the built bcrypt
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./

# Install production dependencies
RUN pnpm install --prod --frozen-lockfile

# Rebuild bcrypt using pnpm
RUN pnpm rebuild bcrypt

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"] 