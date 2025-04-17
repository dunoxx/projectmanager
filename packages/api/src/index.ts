import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import webhookRoutes from './routes/webhookRoutes';

// Carregar variáveis de ambiente
dotenv.config();

// Criar aplicação Express
const app = express();
const port = process.env.API_PORT || 4000;

// Middlewares
app.use(helmet()); // Segurança
app.use(cors()); // CORS
app.use(express.json()); // Parser de JSON
app.use(express.urlencoded({ extended: true })); // Parser de URL encoded

// Middleware de logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Rotas
app.use('/api/webhooks', webhookRoutes);

// Rota para verificação de status
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', version: process.env.npm_package_version });
});

// Middleware para tratamento de erros
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Erro não tratado:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Iniciar o servidor
app.listen(port, () => {
  logger.info(`Servidor API iniciado na porta ${port}`);
  logger.info(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
}); 