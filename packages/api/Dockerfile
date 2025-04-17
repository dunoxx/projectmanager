FROM node:18-alpine

WORKDIR /app

# Copiar arquivos de dependência
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm install

# Gerar cliente Prisma
RUN npx prisma generate

# Copiar o restante dos arquivos
COPY . .

# Compilar TypeScript
RUN npm run build

# Configurar para usar o banco de dados corretamente
ENV DATABASE_URL="postgresql://postgres:postgres@postgres:5432/projectmanager"

# Expor porta da API
EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"] 