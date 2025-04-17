FROM node:18-alpine

WORKDIR /app

# Este é um Dockerfile temporário/placeholder
# No momento, estamos simulando o serviço Outline para desenvolvimento

# Instalar dependências globais
RUN apk add --no-cache curl

ENV PORT 9003
EXPOSE 9003

# Criar página estática temporária
RUN mkdir -p public && \
    echo '<html><head><title>Outline Service</title></head><body style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:Arial,sans-serif;"><div style="text-align:center;"><h1>Outline Service</h1><p>Este serviço está em construção.</p></div></body></html>' > public/index.html

# Comando para iniciar o servidor HTTP estático
CMD ["node", "-e", "const http=require('http');const fs=require('fs');const server=http.createServer((req,res)=>{res.writeHead(200,{'Content-Type':'text/html'});res.end(fs.readFileSync('./public/index.html'))});server.listen(9003,()=>console.log('Outline service running on port 9003'))"] 