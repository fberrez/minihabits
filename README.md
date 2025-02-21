# minihabits.

A minimalist habit tracking app built with NestJS, MongoDB, and JWT, designed to help users build and maintain daily habits with a clean, intuitive interface.

## Features

- 🌓 Dark/Light mode support
- 📱 Clean, modern UI with smooth animations
- 📊 5-day habit tracking view
- 🔥 Streak counting
- 💾 Persistent storage using AsyncStorage
- 📲 Haptic feedback for interactions
- 🔍 Detailed habit view
- ➕ Easy habit creation with modal interface

## Getting Started

### Prerequisites

- Node.js (v20 or later)
- pnpm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/fberrez/minihabits.git
```

2. Install dependencies:

```bash
cd minihabits
pnpm install
```

3. Create a `.env` file in the root of the project with the following variables:

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

```

4. Start the development server:

```bash
npm run start:dev
```
