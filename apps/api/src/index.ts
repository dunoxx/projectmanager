import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { authRoutes } from './routes/auth';
import { projectRoutes } from './routes/projects';
import { documentRoutes } from './routes/documents';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/documents', documentRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 