FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

COPY . .

RUN npm install --frozen-lockfile --force

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"] 