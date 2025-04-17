FROM node:18-alpine as builder

WORKDIR /app

# Instalar dependências globais
RUN apk add --no-cache python3 make g++ bash

# Copiar arquivos de dependências
COPY package.json yarn.lock ./

# Instalar dependências
RUN yarn install --frozen-lockfile

# Copiar código fonte
COPY . .

# Construir a aplicação
RUN yarn build

# Imagem de produção
FROM node:18-alpine

WORKDIR /app

# Copiar dependências e arquivos de build
COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/dist ./dist

# Instalar apenas dependências de produção
RUN yarn install --production --frozen-lockfile

# Expor a porta
EXPOSE 4000

# Comando para iniciar o serviço
CMD ["node", "dist/index.js"] 