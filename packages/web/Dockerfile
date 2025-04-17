FROM node:18-alpine as builder

WORKDIR /app

# Instalar dependências globais
RUN apk add --no-cache python3 make g++ bash

# Copiar arquivos de dependências
COPY package.json ./

# Instalar dependências
RUN yarn install

# Copiar código fonte
COPY . .

# Construir a aplicação
RUN yarn build

# Imagem de produção
FROM node:18-alpine

WORKDIR /app

# Copiar dependências e arquivos de build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

# Instalar apenas dependências de produção
RUN yarn install --production

# Expor a porta
EXPOSE 8080

# Comando para iniciar o serviço
CMD ["yarn", "start"] 