# minihabits

A minimalist habit tracking app built with NestJS (backend) and React + Vite (frontend) in an Nx monorepo, designed to help users build and maintain daily habits with a clean, intuitive interface.

## Architecture

This is an Nx monorepo containing:
- **Backend** (`apps/backend/`) - NestJS API with MongoDB and JWT authentication
- **Frontend** (`apps/frontend/`) - React + Vite SPA with TypeScript and Tailwind CSS

## Features

### Backend
- 🔐 JWT authentication with refresh tokens
- 📊 Habit tracking and statistics
- 📧 Email notifications (Resend)
- 🗄️ MongoDB with Mongoose
- 🛡️ Input validation and security
- 📝 OpenAPI documentation

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
# Start backend (NestJS API on :3000)
pnpm nx serve backend

# Start frontend (Vite dev server on :5173)  
pnpm nx serve frontend

# Or start both simultaneously
pnpm run dev
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

# Generate OpenAPI client for frontend
pnpm nx run frontend:generate-api
```

## Project Structure

```
minihabits/
├── apps/
│   ├── backend/           # NestJS API
│   │   ├── src/
│   │   │   ├── auth/      # Authentication module
│   │   │   ├── habits/    # Habits management
│   │   │   ├── stats/     # Statistics & analytics
│   │   │   ├── users/     # User management
│   │   │   └── ...
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

## Production Deployment

This Nx monorepo is configured for automated deployment using GitHub Actions, Docker, and Traefik.

### Infrastructure

- **Hosting**: VPS - OVH
- **Containerization**: Docker (multi-stage builds)
- **Reverse Proxy**: Traefik
- **SSL**: Let's Encrypt via Traefik
- **Monorepo**: Nx for build optimization and caching

### Deployment Process

1. Push changes to the `main` branch
2. GitHub Actions workflow:
   - Uses Nx to determine what changed
   - Builds only affected applications
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

### Server Requirements

- Docker and Docker Compose
- Traefik v3 configured as a reverse proxy
- External `web` network for Traefik communication

## Technologies

### Backend
- **Framework**: NestJS with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with refresh tokens
- **Validation**: class-validator, class-transformer
- **Email**: Resend API
- **Documentation**: OpenAPI/Swagger
- **Testing**: Jest

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

## License

This project is licensed under the MIT License - see the LICENSE file for details.
