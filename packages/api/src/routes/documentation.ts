import { Router } from 'express';
import DocumentationController from '../controllers/DocumentationController';
import { authenticate } from '../routes/auth';

const router = Router();

/**
 * Rotas para gerenciar a documentação dos projetos
 */

// Obter documentação de um projeto específico
router.get(
  '/:organizationSlug/projects/:projectId',
  authenticate,
  DocumentationController.getProjectDocumentation
);

// Criar nova documentação para um projeto
router.post(
  '/:organizationSlug/projects/:projectId',
  authenticate,
  DocumentationController.createProjectDocumentation
);

// Sincronizar permissões entre projeto e documentação
router.post(
  '/:organizationSlug/projects/:projectId/sync-permissions',
  authenticate,
  DocumentationController.syncProjectDocumentationPermissions
);

export const documentationRoutes = router; 