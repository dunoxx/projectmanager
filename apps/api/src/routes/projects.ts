import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const router = Router();

const projectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

// Middleware de autenticação
const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Não autorizado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded as any;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Não autorizado' });
  }
};

// Criar projeto
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, description } = projectSchema.parse(req.body);
    const userId = req.user.userId;

    const project = await prisma.project.create({
      data: {
        name,
        description,
        ownerId: userId,
        members: {
          create: {
            userId,
            role: 'ADMIN',
          },
        },
      },
      include: {
        members: true,
        documents: true,
      },
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar projeto' });
  }
});

// Listar projetos do usuário
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;

    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
        ],
      },
      include: {
        members: true,
        documents: true,
      },
    });

    res.json(projects);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao listar projetos' });
  }
});

// Obter detalhes de um projeto
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const project = await prisma.project.findFirst({
      where: {
        id,
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
        ],
      },
      include: {
        members: true,
        documents: true,
      },
    });

    if (!project) {
      return res.status(404).json({ message: 'Projeto não encontrado' });
    }

    res.json(project);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao obter projeto' });
  }
});

// Atualizar projeto
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = projectSchema.parse(req.body);
    const userId = req.user.userId;

    const project = await prisma.project.findFirst({
      where: {
        id,
        OR: [
          { ownerId: userId },
          { members: { some: { userId, role: 'ADMIN' } } },
        ],
      },
    });

    if (!project) {
      return res.status(404).json({ message: 'Projeto não encontrado' });
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: { name, description },
      include: {
        members: true,
        documents: true,
      },
    });

    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar projeto' });
  }
});

// Deletar projeto
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const project = await prisma.project.findFirst({
      where: {
        id,
        ownerId: userId,
      },
    });

    if (!project) {
      return res.status(404).json({ message: 'Projeto não encontrado' });
    }

    await prisma.project.delete({
      where: { id },
    });

    res.json({ message: 'Projeto deletado com sucesso' });
  } catch (error) {
    res.status(400).json({ message: 'Erro ao deletar projeto' });
  }
});

export const projectRoutes = router; 