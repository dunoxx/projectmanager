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

# Expor porta da API
EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["npm", "start"] 