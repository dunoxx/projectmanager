import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth';
import { planeRoutes } from './routes/plane';
import { outlineRoutes } from './routes/outline';
import { integrationRoutes } from './routes/integration';
import { documentationRoutes } from './routes/documentation';
import { organizationsRouter } from './routes/organizations';
import { projectsRouter } from './routes/projects';

// Carrega as variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', authRouter);
app.use('/api/plane', planeRoutes);
app.use('/api/outline', outlineRoutes);
app.use('/api/integration', integrationRoutes);
app.use('/api/documentation', documentationRoutes);
app.use('/api/organizations', organizationsRouter);
app.use('/api/projects', projectsRouter);

// Rota de saúde
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API está funcionando corretamente' });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

export default app; 