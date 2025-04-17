import { Router, Request, Response } from 'express';
import { authenticate } from './auth';
import { Organization, OrganizationMember, ApiResponse } from '../types';

// Simulação de banco de dados - em produção seria substituído por um ORM como Prisma
let organizations: Organization[] = [];

export const organizationsRouter = Router();

// Middleware para verificar se o usuário é membro da organização
const checkOrganizationMembership = (req: Request, res: Response, next: Function) => {
  const { organizationId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: 'Usuário não autenticado'
    });
  }

  const organization = organizations.find(o => o.id === organizationId);
  
  if (!organization) {
    return res.status(404).json({
      success: false,
      error: 'Organização não encontrada'
    });
  }

  const isMember = organization.members.some(m => m.userId === userId);
  
  if (!isMember) {
    return res.status(403).json({
      success: false,
      error: 'Você não tem permissão para acessar esta organização'
    });
  }

  next();
};

// Middleware para verificar se o usuário é admin da organização
const checkOrganizationAdmin = (req: Request, res: Response, next: Function) => {
  const { organizationId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: 'Usuário não autenticado'
    });
  }

  const organization = organizations.find(o => o.id === organizationId);
  
  if (!organization) {
    return res.status(404).json({
      success: false,
      error: 'Organização não encontrada'
    });
  }

  const isAdmin = organization.members.some(m => m.userId === userId && m.role === 'admin');
  
  if (!isAdmin) {
    return res.status(403).json({
      success: false,
      error: 'Você não tem permissão de administrador nesta organização'
    });
  }

  next();
};

// Listar organizações do usuário
organizationsRouter.get('/', authenticate, (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: 'Usuário não autenticado'
    });
  }

  const userOrganizations = organizations.filter(org => 
    org.members.some(member => member.userId === userId)
  );

  return res.json({
    success: true,
    data: userOrganizations
  });
});

// Obter uma organização específica
organizationsRouter.get('/:organizationId', authenticate, checkOrganizationMembership, (req: Request, res: Response) => {
  const { organizationId } = req.params;
  const organization = organizations.find(o => o.id === organizationId);

  return res.json({
    success: true,
    data: organization
  });
});

// Criar organização
organizationsRouter.post('/', authenticate, (req: Request, res: Response) => {
  const { name, description } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: 'Usuário não autenticado'
    });
  }

  if (!name) {
    return res.status(400).json({
      success: false,
      error: 'Nome da organização é obrigatório'
    });
  }

  const newOrganization: Organization = {
    id: Date.now().toString(),
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    description: description || '',
    hasOutlineIntegration: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    members: [
      {
        userId,
        role: 'admin',
        joinedAt: new Date()
      }
    ]
  };

  organizations.push(newOrganization);

  return res.status(201).json({
    success: true,
    data: newOrganization
  });
});

// Atualizar organização
organizationsRouter.put('/:organizationId', authenticate, checkOrganizationAdmin, (req: Request, res: Response) => {
  const { organizationId } = req.params;
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      error: 'Nome da organização é obrigatório'
    });
  }

  const organizationIndex = organizations.findIndex(o => o.id === organizationId);
  
  if (organizationIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Organização não encontrada'
    });
  }

  organizations[organizationIndex] = {
    ...organizations[organizationIndex],
    name,
    description: description || organizations[organizationIndex].description,
    updatedAt: new Date()
  };

  return res.json({
    success: true,
    data: organizations[organizationIndex]
  });
});

// Excluir organização
organizationsRouter.delete('/:organizationId', authenticate, checkOrganizationAdmin, (req: Request, res: Response) => {
  const { organizationId } = req.params;
  const organizationIndex = organizations.findIndex(o => o.id === organizationId);
  
  if (organizationIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Organização não encontrada'
    });
  }

  organizations.splice(organizationIndex, 1);

  return res.json({
    success: true,
    data: null
  });
});

// Adicionar membro à organização
organizationsRouter.post('/:organizationId/members', authenticate, checkOrganizationAdmin, (req: Request, res: Response) => {
  const { organizationId } = req.params;
  const { userId, role } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      error: 'ID do usuário é obrigatório'
    });
  }

  const organization = organizations.find(o => o.id === organizationId);
  
  if (!organization) {
    return res.status(404).json({
      success: false,
      error: 'Organização não encontrada'
    });
  }

  const existingMember = organization.members.find(m => m.userId === userId);
  
  if (existingMember) {
    return res.status(400).json({
      success: false,
      error: 'Usuário já é membro desta organização'
    });
  }

  const newMember: OrganizationMember = {
    userId,
    role: role || 'member',
    joinedAt: new Date()
  };

  organization.members.push(newMember);
  organization.updatedAt = new Date();

  return res.status(201).json({
    success: true,
    data: newMember
  });
});

// Remover membro da organização
organizationsRouter.delete('/:organizationId/members/:memberId', authenticate, checkOrganizationAdmin, (req: Request, res: Response) => {
  const { organizationId, memberId } = req.params;
  const organization = organizations.find(o => o.id === organizationId);
  
  if (!organization) {
    return res.status(404).json({
      success: false,
      error: 'Organização não encontrada'
    });
  }

  const memberIndex = organization.members.findIndex(m => m.userId === memberId);
  
  if (memberIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Membro não encontrado nesta organização'
    });
  }

  // Impedir a remoção do último administrador
  const adminCount = organization.members.filter(m => m.role === 'admin').length;
  const isLastAdmin = adminCount === 1 && organization.members[memberIndex].role === 'admin';
  
  if (isLastAdmin) {
    return res.status(400).json({
      success: false,
      error: 'Não é possível remover o último administrador da organização'
    });
  }

  organization.members.splice(memberIndex, 1);
  organization.updatedAt = new Date();

  return res.json({
    success: true,
    data: null
  });
});

// Atualizar função de membro na organização
organizationsRouter.put('/:organizationId/members/:memberId', authenticate, checkOrganizationAdmin, (req: Request, res: Response) => {
  const { organizationId, memberId } = req.params;
  const { role } = req.body;

  if (!role || !['admin', 'member'].includes(role)) {
    return res.status(400).json({
      success: false,
      error: 'Função inválida. Use "admin" ou "member"'
    });
  }

  const organization = organizations.find(o => o.id === organizationId);
  
  if (!organization) {
    return res.status(404).json({
      success: false,
      error: 'Organização não encontrada'
    });
  }

  const memberIndex = organization.members.findIndex(m => m.userId === memberId);
  
  if (memberIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Membro não encontrado nesta organização'
    });
  }

  // Impedir a remoção do último administrador
  const adminCount = organization.members.filter(m => m.role === 'admin').length;
  const isLastAdmin = adminCount === 1 && 
                      organization.members[memberIndex].role === 'admin' && 
                      role !== 'admin';
  
  if (isLastAdmin) {
    return res.status(400).json({
      success: false,
      error: 'Não é possível rebaixar o último administrador da organização'
    });
  }

  organization.members[memberIndex].role = role;
  organization.updatedAt = new Date();

  return res.json({
    success: true,
    data: organization.members[memberIndex]
  });
});

// Listar membros da organização
organizationsRouter.get('/:organizationId/members', authenticate, checkOrganizationMembership, (req: Request, res: Response) => {
  const { organizationId } = req.params;
  const organization = organizations.find(o => o.id === organizationId);
  
  if (!organization) {
    return res.status(404).json({
      success: false,
      error: 'Organização não encontrada'
    });
  }

  return res.json({
    success: true,
    data: organization.members
  });
}); 