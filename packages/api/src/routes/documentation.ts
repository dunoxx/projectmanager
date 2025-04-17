import { Router } from 'express';
import DocumentationController from '../controllers/DocumentationController';
import { authenticate } from '../routes/auth';
import { body, param } from 'express-validator';
import { validateRequest } from '../utils/validators';

/**
 * Rotas para gerenciar a documentação dos projetos
 * Integração entre projetos Plane e coleções Outline
 */
const router = Router();

/**
 * @route   GET /:organizationSlug/projects/:projectId
 * @desc    Obtém a documentação (coleção do Outline) associada a um projeto específico
 * @access  Privado (requer autenticação)
 */
router.get(
  '/:organizationSlug/projects/:projectId',
  authenticate,
  [
    param('organizationSlug').isString().trim().notEmpty().withMessage('Slug da organização é obrigatório'),
    param('projectId').isString().trim().notEmpty().withMessage('ID do projeto é obrigatório'),
    validateRequest
  ],
  DocumentationController.getProjectDocumentation
);

/**
 * @route   POST /:organizationSlug/projects/:projectId
 * @desc    Cria uma nova documentação (coleção no Outline) para um projeto
 * @access  Privado (requer autenticação)
 */
router.post(
  '/:organizationSlug/projects/:projectId',
  authenticate,
  [
    param('organizationSlug').isString().trim().notEmpty().withMessage('Slug da organização é obrigatório'),
    param('projectId').isString().trim().notEmpty().withMessage('ID do projeto é obrigatório'),
    body('projectName').isString().trim().notEmpty().withMessage('Nome do projeto é obrigatório'),
    validateRequest
  ],
  DocumentationController.createProjectDocumentation
);

/**
 * @route   POST /:organizationSlug/projects/:projectId/sync-permissions
 * @desc    Sincroniza as permissões entre o projeto e sua documentação
 * @access  Privado (requer autenticação)
 */
router.post(
  '/:organizationSlug/projects/:projectId/sync-permissions',
  authenticate,
  [
    param('organizationSlug').isString().trim().notEmpty().withMessage('Slug da organização é obrigatório'),
    param('projectId').isString().trim().notEmpty().withMessage('ID do projeto é obrigatório'),
    validateRequest
  ],
  DocumentationController.syncProjectDocumentationPermissions
);

/**
 * @route   GET /:organizationSlug/projects/
 * @desc    Lista todas as documentações disponíveis para a organização
 * @access  Privado (requer autenticação)
 */
router.get(
  '/:organizationSlug/projects',
  authenticate,
  [
    param('organizationSlug').isString().trim().notEmpty().withMessage('Slug da organização é obrigatório'),
    validateRequest
  ],
  DocumentationController.getOrganizationDocumentations
);

/**
 * @route   DELETE /:organizationSlug/projects/:projectId
 * @desc    Remove a associação entre um projeto e sua documentação
 * @access  Privado (requer autenticação)
 */
router.delete(
  '/:organizationSlug/projects/:projectId',
  authenticate,
  [
    param('organizationSlug').isString().trim().notEmpty().withMessage('Slug da organização é obrigatório'),
    param('projectId').isString().trim().notEmpty().withMessage('ID do projeto é obrigatório'),
    validateRequest
  ],
  DocumentationController.unlinkProjectDocumentation
);

/**
 * @route   GET /statistics
 * @desc    Obtém estatísticas sobre a documentação de projetos
 * @access  Privado (requer autenticação)
 */
router.get(
  '/statistics',
  authenticate,
  DocumentationController.getDocumentationStatistics
);

export const documentationRoutes = router; 