FROM node:18-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependência
COPY package*.json ./

# Instalar dependências
RUN npm install

# Criar diretório public se não existir
RUN mkdir -p public

# Copiar o código fonte
COPY . .

# Compilar a aplicação
RUN npm run build

# Segunda etapa: ambiente de produção
FROM node:18-alpine AS runner

WORKDIR /app

# Criar diretório public necessário
RUN mkdir -p public

# Copiar apenas arquivos necessários da etapa de build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.js ./
# Tratar o caso da pasta public vazia ou inexistente 
RUN mkdir -p ./public
COPY --from=builder /app/public/ ./public/
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

# Expor porta do frontend
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"] 