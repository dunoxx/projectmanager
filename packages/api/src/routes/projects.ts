import { Router, Request, Response } from 'express';
import { authenticate } from './auth';
import { PlaneProject, ApiResponse } from '../types';

// Simulação de banco de dados - em produção seria substituído por um ORM como Prisma
let projects: PlaneProject[] = [];

export const projectsRouter = Router();

// Middleware para verificar se o usuário tem acesso ao projeto
const checkProjectAccess = async (req: Request, res: Response, next: Function) => {
  const { projectId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: 'Usuário não autenticado'
    });
  }

  const project = projects.find(p => p.id === projectId);
  
  if (!project) {
    return res.status(404).json({
      success: false,
      error: 'Projeto não encontrado'
    });
  }

  // Aqui, em uma implementação real, verificaríamos se o usuário
  // tem acesso à organização do projeto através da tabela de membros

  // Simulação simplificada para o protótipo:
  // Assumimos que se o projeto existe, o usuário tem acesso,
  // pois verificaremos a associação com a organização em uma implementação completa

  next();
};

// Listar todos os projetos da organização
projectsRouter.get('/organization/:organizationId', authenticate, (req: Request, res: Response) => {
  const { organizationId } = req.params;
  
  const organizationProjects = projects.filter(
    project => project.organizationId === organizationId
  );

  return res.json({
    success: true,
    data: organizationProjects
  });
});

// Obter detalhes de um projeto específico
projectsRouter.get('/:projectId', authenticate, checkProjectAccess, (req: Request, res: Response) => {
  const { projectId } = req.params;
  const project = projects.find(p => p.id === projectId);

  return res.json({
    success: true,
    data: project
  });
});

// Criar um novo projeto
projectsRouter.post('/', authenticate, (req: Request, res: Response) => {
  const { name, slug, organizationId, outlineCollectionId } = req.body;

  if (!name || !slug || !organizationId) {
    return res.status(400).json({
      success: false,
      error: 'Nome, slug e ID da organização são obrigatórios'
    });
  }

  // Verificar se já existe um projeto com o mesmo slug na organização
  const existingProject = projects.find(
    p => p.slug === slug && p.organizationId === organizationId
  );

  if (existingProject) {
    return res.status(400).json({
      success: false,
      error: 'Já existe um projeto com este slug nesta organização'
    });
  }

  const newProject: PlaneProject = {
    id: Date.now().toString(),
    name,
    slug,
    organizationId,
    outlineCollectionId,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  projects.push(newProject);

  return res.status(201).json({
    success: true,
    data: newProject
  });
});

// Atualizar um projeto existente
projectsRouter.put('/:projectId', authenticate, checkProjectAccess, (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { name, slug, outlineCollectionId } = req.body;

  const projectIndex = projects.findIndex(p => p.id === projectId);
  
  if (projectIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Projeto não encontrado'
    });
  }

  const project = projects[projectIndex];

  // Verificar se o slug atualizado já existe (se foi alterado)
  if (slug && slug !== project.slug) {
    const slugExists = projects.some(
      p => p.slug === slug && 
          p.organizationId === project.organizationId && 
          p.id !== projectId
    );

    if (slugExists) {
      return res.status(400).json({
        success: false,
        error: 'Já existe um projeto com este slug nesta organização'
      });
    }
  }

  // Atualizar o projeto
  projects[projectIndex] = {
    ...project,
    name: name || project.name,
    slug: slug || project.slug,
    outlineCollectionId: outlineCollectionId !== undefined ? outlineCollectionId : project.outlineCollectionId,
    updatedAt: new Date()
  };

  return res.json({
    success: true,
    data: projects[projectIndex]
  });
});

// Excluir um projeto
projectsRouter.delete('/:projectId', authenticate, checkProjectAccess, (req: Request, res: Response) => {
  const { projectId } = req.params;
  
  const projectIndex = projects.findIndex(p => p.id === projectId);
  
  if (projectIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Projeto não encontrado'
    });
  }

  // Em uma implementação real, aqui também faríamos:
  // 1. Deletar todas as tarefas associadas a este projeto
  // 2. Remover a associação com a coleção do Outline (se existir)

  projects.splice(projectIndex, 1);

  return res.json({
    success: true,
    message: 'Projeto excluído com sucesso'
  });
});

// Vincular um projeto com uma coleção do Outline
projectsRouter.post('/:projectId/link-outline-collection', authenticate, checkProjectAccess, (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { outlineCollectionId } = req.body;

  if (!outlineCollectionId) {
    return res.status(400).json({
      success: false,
      error: 'ID da coleção do Outline é obrigatório'
    });
  }

  const projectIndex = projects.findIndex(p => p.id === projectId);
  
  if (projectIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Projeto não encontrado'
    });
  }

  // Atualizar o projeto com o ID da coleção do Outline
  projects[projectIndex] = {
    ...projects[projectIndex],
    outlineCollectionId,
    updatedAt: new Date()
  };

  // Em uma implementação real, aqui também atualizaríamos a coleção no Outline
  // para refletir a associação com o projeto do Plane

  return res.json({
    success: true,
    message: 'Projeto vinculado à coleção do Outline com sucesso',
    data: projects[projectIndex]
  });
});

// Desvincular um projeto de uma coleção do Outline
projectsRouter.post('/:projectId/unlink-outline-collection', authenticate, checkProjectAccess, (req: Request, res: Response) => {
  const { projectId } = req.params;
  
  const projectIndex = projects.findIndex(p => p.id === projectId);
  
  if (projectIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Projeto não encontrado'
    });
  }

  if (!projects[projectIndex].outlineCollectionId) {
    return res.status(400).json({
      success: false,
      error: 'Este projeto não está vinculado a nenhuma coleção do Outline'
    });
  }

  // Atualizar o projeto removendo o ID da coleção do Outline
  projects[projectIndex] = {
    ...projects[projectIndex],
    outlineCollectionId: undefined,
    updatedAt: new Date()
  };

  // Em uma implementação real, aqui também atualizaríamos a coleção no Outline
  // para remover a associação com o projeto do Plane

  return res.json({
    success: true,
    message: 'Projeto desvinculado da coleção do Outline com sucesso',
    data: projects[projectIndex]
  });
}); 