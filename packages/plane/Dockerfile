FROM node:18-alpine

WORKDIR /app

# Este é um Dockerfile temporário/placeholder
# No momento, estamos simulando o serviço Plane para desenvolvimento

# Instalar dependências globais
RUN apk add --no-cache curl

# Criar um arquivo HTML simples para indicar que o serviço está em construção
RUN mkdir -p public && \
    echo '<html><head><title>Plane Service</title></head><body style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:Arial,sans-serif;"><div style="text-align:center;"><h1>Plane Service</h1><p>Este serviço está em construção.</p></div></body></html>' > public/index.html

# Expor a porta
EXPOSE 3000

# Iniciar um servidor web simples 
CMD ["node", "-e", "const http=require('http');const fs=require('fs');const server=http.createServer((req,res)=>{res.writeHead(200,{'Content-Type':'text/html'});res.end(fs.readFileSync('./public/index.html'))});server.listen(3000,()=>console.log('Plane service running on port 3000'))"] 