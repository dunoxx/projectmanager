FROM node:18-alpine

WORKDIR /app

# Instalar dependências globais
RUN apk add --no-cache python3 make g++ bash

# Copiar arquivos de dependências
COPY package.json ./

# Instalar dependências
RUN yarn install

# Criar pasta dist e arquivo JavaScript simples
RUN mkdir -p dist && \
    echo 'console.log("API iniciando...");\n\
const http = require("http");\n\
\n\
const server = http.createServer((req, res) => {\n\
  res.writeHead(200, { "Content-Type": "application/json" });\n\
  const response = {\n\
    status: "ok",\n\
    message: "API do Project Manager está funcionando!"\n\
  };\n\
  res.end(JSON.stringify(response));\n\
});\n\
\n\
const port = process.env.PORT || 4000;\n\
server.listen(port, () => {\n\
  console.log(`Servidor rodando na porta ${port}`);\n\
});' > dist/index.js

# Copiar código fonte
COPY . .

# Expor a porta
EXPOSE 4000

# Comando para iniciar o serviço
CMD ["node", "dist/index.js"] 