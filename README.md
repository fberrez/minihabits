# minihabits

A minimalist habit tracking app built with NestJS (backend) and React + Vite (frontend) in an Nx monorepo, designed to help users build and maintain daily habits with a clean, intuitive interface.

## Architecture

This is an Nx monorepo containing:
- **Backend** (`apps/backend/`) - NestJS API with MongoDB, JWT authentication, and SWC for fast compilation
- **Frontend** (`apps/frontend/`) - React + Vite SPA with TypeScript and Tailwind CSS

## Features

### Backend
- 🔐 JWT authentication with refresh tokens
- 📊 Habit tracking and statistics
- 📧 Email notifications (Resend)
- 🗄️ MongoDB with Mongoose
- 🛡️ Input validation and security
- 📝 OpenAPI documentation
- ⚡ Fast compilation with SWC (10x faster than tsc)
- 🔄 Hot reload development with source maps

### Frontend
- 🌓 Dark/Light mode support
- 📱 Responsive, modern UI with Tailwind CSS
- 📊 Interactive habit tracking with heatmaps
- 🔥 Streak counting and statistics
- 📈 Visual charts and progress tracking
- 🎵 Audio feedback for habit completion
- ⚡ Fast development with Vite

## Getting Started

### Prerequisites

- Node.js (v20 or later)
- pnpm
- MongoDB (local or remote)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/fberrez/minihabits.git
cd minihabits
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file in the `apps/backend/` directory with the following variables:

```bash
CORS_ORIGIN="http://localhost:5173"
FRONTEND_URL="http://localhost:5173"
JWT_EXPIRATION_TIME="7d"
JWT_REFRESH_EXPIRATION_TIME="30d"
JWT_REFRESH_SECRET="refresh_secret"
JWT_SECRET="secret"
MONGODB_URI="mongodb://admin:password@localhost:27017/minihabits"
NODE_ENV="development"
PORT="3000"
RESEND_API_KEY="re_11234"
RESEND_FROM="Minihabits <youraddres@host.co>"
RESEND_AUDIENCE_ID="your-audience-id"
```

### Development

#### Start both applications:

```bash
# Start backend with hot reload (SWC + nodemon on :3000)
pnpm nx dev backend

# Start frontend (Vite dev server on :5173)  
pnpm nx serve frontend

# Or start both simultaneously from root
pnpm run dev
```

#### Backend-specific development commands:

```bash
# Development with hot reload (recommended)
pnpm nx dev backend

# Build once with SWC
pnpm nx build backend

# Production start (after build)
pnpm nx serve backend

# Type check only (no compilation)
pnpm nx type-check backend

# Clean build artifacts
pnpm nx clean backend

# Direct package.json script usage
cd apps/backend
pnpm run dev          # Hot reload development
pnpm run build        # Build with SWC
pnpm run type-check   # TypeScript type checking
```

#### Other useful commands:

```bash
# Build applications
pnpm nx build backend
pnpm nx build frontend

# Run tests
pnpm nx test backend
pnpm nx test frontend

# Lint code
pnpm nx lint backend
pnpm nx lint frontend

# Generate OpenAPI client for frontend (after API changes)
pnpm nx run frontend:generate-api
```

## Project Structure

```
minihabits/
├── apps/
│   ├── backend/           # NestJS API (SWC compilation)
│   │   ├── src/
│   │   │   ├── auth/      # Authentication module
│   │   │   ├── habits/    # Habits management
│   │   │   ├── stats/     # Statistics & analytics
│   │   │   ├── users/     # User management
│   │   │   └── ...
│   │   ├── .swcrc         # SWC compiler configuration
│   │   ├── project.json   # Nx project configuration
│   │   └── Dockerfile
│   └── frontend/          # React + Vite SPA
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── api/       # Generated OpenAPI client
│       │   └── ...
│       └── Dockerfile
├── bruno/                 # API testing collection
├── nx.json               # Nx workspace configuration
└── docker-compose.yml    # Development containers
```

## Backend Build System

The backend uses **SWC** instead of the traditional TypeScript compiler or Nest CLI for significantly faster builds:

### Key Features
- ⚡ **10x faster compilation** than TypeScript compiler
- 🗺️ **Source maps enabled** - errors point to TypeScript files
- 🔄 **Hot reload** with nodemon + concurrently
- 🔧 **Path mapping support** for absolute imports
- 📦 **Nx integration** with build caching
- 🎯 **No Nest CLI dependency** - streamlined toolchain

### Build Configuration
- **Compiler**: SWC with custom configuration (`.swcrc`)
- **Path mapping**: Supports absolute imports (`src/*`)
- **Source maps**: Enabled for proper error reporting
- **Hot reload**: Automatic rebuild and restart on file changes
- **Type checking**: Runs separately via TypeScript compiler

### Development Workflow
1. **File change detected** → SWC rebuilds instantly
2. **Build complete** → nodemon restarts Node.js process
3. **Error occurs** → Stack trace shows TypeScript file locations
4. **Repeat** → Fast iteration cycle

## Production Deployment

This Nx monorepo is configured for automated deployment using GitHub Actions, Docker, and Traefik.

### Infrastructure

- **Hosting**: VPS - OVH
- **Containerization**: Docker (multi-stage builds)
- **Backend Compilation**: SWC for fast production builds
- **Reverse Proxy**: Traefik
- **SSL**: Let's Encrypt via Traefik
- **Monorepo**: Nx for build optimization and caching

### Deployment Process

1. Push changes to the `main` branch
2. GitHub Actions workflow:
   - Uses Nx to determine what changed
   - Builds only affected applications with SWC
   - Creates optimized Docker images
   - Pushes to GitHub Container Registry
3. Deploys to VPS using SSH
4. Traefik handles routing and SSL certificates

### Docker Usage

```bash
# Development with Docker Compose
docker-compose up -d

# Build production images
docker build -f apps/backend/Dockerfile -t minihabits-backend .
docker build -f apps/frontend/Dockerfile -t minihabits-frontend .
```

## Technologies

### Backend
- **Framework**: NestJS with TypeScript
- **Compiler**: SWC (replacing tsc and Nest CLI)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with refresh tokens
- **Validation**: class-validator, class-transformer
- **Email**: Resend API
- **Documentation**: OpenAPI/Swagger
- **Testing**: Jest
- **Development**: Hot reload with nodemon + concurrently

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Radix UI
- **Charts**: Recharts
- **HTTP Client**: Generated from OpenAPI spec
- **State Management**: React Query (TanStack Query)

### DevOps & Tools
- **Monorepo**: Nx
- **Package Manager**: pnpm
- **Containerization**: Docker
- **API Testing**: Bruno
- **Code Quality**: ESLint, Prettier
- **CI/CD**: GitHub Actions

## Development Notes

### SWC vs Traditional NestJS Build
This project uses SWC instead of the traditional Nest CLI or TypeScript compiler:

| Feature | Nest CLI | SWC |
|---------|----------|-----|
| Build Speed | ~3-5s | ~0.1s |
| Hot Reload | Built-in | Custom setup |
| Source Maps | ✅ | ✅ |
| Dependencies | @nestjs/cli | @swc/cli |
| Configuration | nest-cli.json | .swcrc |

### Critical API Development Workflow

⚠️ **IMPORTANT**: When making API changes (controllers, DTOs, endpoints):

```bash
# 1. Make your backend changes
# 2. Start backend to generate new OpenAPI spec
pnpm nx dev backend

# 3. In another terminal, regenerate frontend client
cd apps/frontend
pnpm run generate-api

# 4. Now make frontend changes with proper types
```

This ensures type safety across the full stack.

### Common Issues & Solutions

- **Dependency injection errors**: Add explicit `@Inject()` decorators
- **Swagger circular dependencies**: Use explicit `type` parameters in `@ApiProperty`
- **Path mapping issues**: Check `.swcrc` configuration
- **Missing source maps**: Ensure `--enable-source-maps` is used

## License

This project is licensed under the MIT License - see the LICENSE file for details.
