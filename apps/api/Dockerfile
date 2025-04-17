FROM node:18-alpine AS builder

WORKDIR /app

# Copiar arquivos de configuração do workspace
COPY package.json pnpm-workspace.yaml turbo.json ./
COPY apps/api/package.json ./apps/api/

# Instalar pnpm e dependências
RUN npm install -g pnpm
RUN pnpm install

# Copiar o resto dos arquivos
COPY . .

# Build da API
WORKDIR /app/apps/api
RUN pnpm build

FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=builder /app/apps/api/prisma ./prisma

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "dist/index.js"] 