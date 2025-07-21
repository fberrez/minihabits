# Deployment Configuration

This project now uses separate deployment workflows for backend and frontend services to improve reliability and allow independent deployments.

## Deployment Workflows

### Backend Deployment (`.github/workflows/deploy-backend.yml`)
- **Triggers**: Changes to `apps/backend/**`, `package.json`, `pnpm-lock.yaml`, or the workflow file itself
- **Deploys to**: `~/minihabits-backend/` on VPS
- **Container**: `minihabits-backend`
- **Domain**: `minihabits-api.fberrez.co`
- **Port**: 3000

### Frontend Deployment (`.github/workflows/deploy-frontend.yml`)
- **Triggers**: Changes to `apps/frontend/**`, `package.json`, `pnpm-lock.yaml`, or the workflow file itself
- **Deploys to**: `~/minihabits-web/` on VPS
- **Container**: `minihabits-web`
- **Domain**: `minihabits.fberrez.co`
- **Port**: 80

## Key Improvements

1. **Separate Deployments**: Backend and frontend can be deployed independently
2. **Path-based Triggers**: Only deploy when relevant files change
3. **Isolated Environments**: Each service has its own deployment directory
4. **Better Error Isolation**: Frontend deployment issues won't affect backend and vice versa

## Required Secrets and Variables

### Secrets
- `VPS_HOST`: Your VPS server hostname/IP
- `VPS_USERNAME`: SSH username for VPS
- `VPS_SSH_KEY`: SSH private key for VPS access
- `GITHUB_TOKEN`: Automatically provided by GitHub
- Backend-specific secrets (JWT secrets, API keys, etc.)

### Variables
- `VITE_API_BASE_URL`: Frontend API base URL
- `VITE_CONTACT_EMAIL`: Contact email for frontend
- `VITE_STRIPE_PRICE_*_ID`: Stripe pricing IDs
- Other environment-specific variables

## Manual Deployment

You can trigger deployments manually using the "workflow_dispatch" event in the GitHub Actions tab.

## Migration from Old Deployment

The old combined deployment workflow has been renamed to `deploy-old.yml` and can be removed once the new separate deployments are confirmed working.