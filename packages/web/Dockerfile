FROM node:18-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependência
COPY package*.json ./

# Instalar todas as dependências (incluindo dev dependencies necessárias para build)
RUN npm install

# Criar diretório public se não existir
RUN mkdir -p public

# Copiar o código fonte
COPY . .

# Definir variáveis de ambiente para o build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=/api
ENV NEXT_PUBLIC_PLANE_URL=/plane
ENV NEXT_PUBLIC_OUTLINE_URL=/outline

# Compilar a aplicação
RUN npm run build

# Segunda etapa: ambiente de produção
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_URL=/api
ENV NEXT_PUBLIC_PLANE_URL=/plane
ENV NEXT_PUBLIC_OUTLINE_URL=/outline

# Criar diretório public necessário
RUN mkdir -p public

# Copiar apenas arquivos necessários da etapa de build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.js ./
# Tratar o caso da pasta public vazia ou inexistente 
RUN mkdir -p ./public
COPY --from=builder /app/public/ ./public/
COPY --from=builder /app/.next ./.next

# Instalar apenas dependências de produção
RUN npm ci --only=production

# Expor porta do frontend
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"] 