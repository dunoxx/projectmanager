console.log('API do Project Manager iniciando...');

// Servidor básico com HTTP nativo
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  
  const response = {
    status: 'ok',
    message: 'API do Project Manager está funcionando!',
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  };
  
  res.end(JSON.stringify(response));
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
}); 