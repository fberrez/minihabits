# minihabits

A minimalist habit tracking app built with NestJS (backend) and React + Vite (frontend) in an Turborepo monorepo, designed to help users build and maintain daily habits with a clean, intuitive interface.

## Architecture

This is an Turborepo monorepo containing:
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

3. Create a `.env` file in both `apps/backend/` and `apps/frontend` directories using `.env.example`

### Development

#### Start both applications:

```bash
# Start backend and frontend with hot reload
pnpm run dev
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
│   │   └── Dockerfile
│   └── frontend/          # React + Vite SPA
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── api/       # Generated OpenAPI client
│       │   └── ...
│       └── Dockerfile
├── bruno/                 # API testing collection
└── docker-compose.yml    # Development containers
```

## Backend Build System

The backend uses **SWC** instead of the traditional TypeScript compiler or Nest CLI for significantly faster builds:

### Key Features
- ⚡ **10x faster compilation** than TypeScript compiler
- 🗺️ **Source maps enabled** - errors point to TypeScript files
- 🔄 **Hot reload** with nodemon + concurrently
- 🔧 **Path mapping support** for absolute imports
- 📦 **Turborepo integration** with build caching
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

### Infrastructure

- **Hosting**: VPS - OVH
- **Containerization**: Docker (multi-stage builds)
- **Backend Compilation**: SWC for fast production builds
- **Reverse Proxy**: Traefik
- **SSL**: Let's Encrypt via Traefik
- **Monorepo**: Turborepo for build optimization and caching

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
- **Monorepo**: Turborepo
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

## License

This project is licensed under the GNU License - see the LICENSE file for details.
