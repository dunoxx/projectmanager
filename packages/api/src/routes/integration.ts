import { Router, Request, Response } from 'express';
import { authenticate } from './auth';
import ProjectDocumentationService from '../services/ProjectDocumentationService';
import { logger } from '../utils/logger';

const router = Router();

/**
 * Rotas para gerenciar a integração entre Plane e Outline
 * Estas rotas cuidam da sincronização e configuração entre os dois sistemas
 */

// Vincular um projeto do Plane a uma collection do Outline
router.post('/link-project-collection', authenticate, async (req: Request, res: Response) => {
  try {
    const { projectId, projectName, organizationSlug } = req.body;
    const userId = req.user?.id;

    if (!projectId || !projectName || !organizationSlug || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Dados incompletos para vincular projeto e collection'
      });
    }

    const result = await ProjectDocumentationService.createCollectionForProject(
      projectId,
      projectName,
      organizationSlug,
      userId
    );

    if (result) {
      return res.status(201).json({
        success: true,
        message: 'Projeto vinculado à collection com sucesso',
        data: {
          projectId,
          collectionId: result.collectionId,
          organizationSlug
        }
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Falha ao vincular projeto à collection'
      });
    }
  } catch (error) {
    logger.error('Erro ao vincular projeto à collection:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao processar a solicitação'
    });
  }
});

// Sincronizar permissões entre projeto do Plane e collection do Outline
router.post('/sync-permissions', authenticate, async (req: Request, res: Response) => {
  try {
    const { projectId, organizationSlug } = req.body;

    if (!projectId || !organizationSlug) {
      return res.status(400).json({
        success: false,
        error: 'Projeto e organização são obrigatórios'
      });
    }

    const result = await ProjectDocumentationService.syncPermissions(
      projectId,
      organizationSlug
    );

    if (result) {
      return res.json({
        success: true,
        message: 'Permissões sincronizadas com sucesso'
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Falha ao sincronizar permissões'
      });
    }
  } catch (error) {
    logger.error('Erro ao sincronizar permissões:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao processar a solicitação'
    });
  }
});

// Obter informações da collection associada a um projeto
router.get('/project-collection/:projectId', authenticate, async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { organizationSlug } = req.query;

    if (!organizationSlug) {
      return res.status(400).json({
        success: false,
        error: 'Organização é obrigatória'
      });
    }

    const collection = await ProjectDocumentationService.getProjectCollection(
      projectId,
      organizationSlug as string
    );

    if (collection) {
      return res.json({
        success: true,
        data: collection
      });
    } else {
      return res.status(404).json({
        success: false,
        error: 'Nenhuma collection encontrada para este projeto'
      });
    }
  } catch (error) {
    logger.error('Erro ao buscar collection do projeto:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao processar a solicitação'
    });
  }
});

// Rota genérica de saúde para verificar o status da integração
router.get('/health', (req: Request, res: Response) => {
  return res.json({
    success: true,
    message: 'Sistema de integração funcionando corretamente',
    services: {
      plane: {
        status: 'online',
        url: process.env.PLANE_URL || 'http://plane:3000'
      },
      outline: {
        status: 'online',
        url: process.env.OUTLINE_URL || 'http://outline:3001'
      }
    }
  });
});

export const integrationRoutes = router; 