import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();
const router = Router();

const documentSchema = z.object({
  title: z.string().min(1),
  content: z.string(),
  projectId: z.string(),
});

// Middleware de autenticação
const authenticate = async (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Não autorizado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Não autorizado' });
  }
};

// Criar documento
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, content, projectId } = documentSchema.parse(req.body);
    const userId = req.user.userId;

    // Verificar se o usuário tem acesso ao projeto
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
        ],
      },
    });

    if (!project) {
      return res.status(404).json({ message: 'Projeto não encontrado' });
    }

    const document = await prisma.document.create({
      data: {
        title,
        content,
        projectId,
        authorId: userId,
      },
    });

    res.status(201).json(document);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar documento' });
  }
});

// Listar documentos de um projeto
router.get('/project/:projectId', authenticate, async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.userId;

    // Verificar se o usuário tem acesso ao projeto
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
        ],
      },
    });

    if (!project) {
      return res.status(404).json({ message: 'Projeto não encontrado' });
    }

    const documents = await prisma.document.findMany({
      where: { projectId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json(documents);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao listar documentos' });
  }
});

// Obter detalhes de um documento
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const document = await prisma.document.findFirst({
      where: {
        id,
        project: {
          OR: [
            { ownerId: userId },
            { members: { some: { userId } } },
          ],
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!document) {
      return res.status(404).json({ message: 'Documento não encontrado' });
    }

    res.json(document);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao obter documento' });
  }
});

// Atualizar documento
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = documentSchema.omit({ projectId: true }).parse(req.body);
    const userId = req.user.userId;

    const document = await prisma.document.findFirst({
      where: {
        id,
        OR: [
          { authorId: userId },
          {
            project: {
              OR: [
                { ownerId: userId },
                { members: { some: { userId, role: 'ADMIN' } } },
              ],
            },
          },
        ],
      },
    });

    if (!document) {
      return res.status(404).json({ message: 'Documento não encontrado' });
    }

    const updatedDocument = await prisma.document.update({
      where: { id },
      data: { title, content },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json(updatedDocument);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar documento' });
  }
});

// Deletar documento
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const document = await prisma.document.findFirst({
      where: {
        id,
        OR: [
          { authorId: userId },
          {
            project: {
              OR: [
                { ownerId: userId },
                { members: { some: { userId, role: 'ADMIN' } } },
              ],
            },
          },
        ],
      },
    });

    if (!document) {
      return res.status(404).json({ message: 'Documento não encontrado' });
    }

    await prisma.document.delete({
      where: { id },
    });

    res.json({ message: 'Documento deletado com sucesso' });
  } catch (error) {
    res.status(400).json({ message: 'Erro ao deletar documento' });
  }
});

export const documentRoutes = router; 