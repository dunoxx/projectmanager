import { Request, Response } from 'express';
import ProjectDocumentationService from '../services/ProjectDocumentationService';
import { logger } from '../utils/logger';

/**
 * Controlador para gerenciar a documentação de projetos
 * Integra os projetos do Plane com documentação no Outline
 */
class DocumentationController {
  /**
   * Obtém a documentação de um projeto específico
   * @param req Request
   * @param res Response
   */
  async getProjectDocumentation(req: Request, res: Response) {
    try {
      const { projectId } = req.params;
      const { organizationSlug } = req.params;
      const token = req.headers.authorization?.split(' ')[1] || '';

      if (!projectId || !organizationSlug) {
        return res.status(400).json({
          success: false,
          message: 'ID do projeto e slug da organização são obrigatórios'
        });
      }

      const result = await ProjectDocumentationService.getProjectDocumentation(
        projectId,
        organizationSlug,
        token
      );

      if (!result.success) {
        return res.status(404).json(result);
      }

      return res.json(result);
    } catch (error: any) {
      logger.error('Erro ao obter documentação do projeto:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao obter documentação do projeto'
      });
    }
  }

  /**
   * Cria uma nova documentação para um projeto
   * @param req Request
   * @param res Response
   */
  async createProjectDocumentation(req: Request, res: Response) {
    try {
      const { projectId } = req.params;
      const { organizationSlug } = req.params;
      const { projectName } = req.body;
      const userId = req.user?.id || '';
      const token = req.headers.authorization?.split(' ')[1] || '';

      if (!projectId || !organizationSlug || !projectName || !userId) {
        return res.status(400).json({
          success: false,
          message: 'Dados incompletos para criar documentação do projeto'
        });
      }

      const result = await ProjectDocumentationService.createProjectDocumentation(
        projectId,
        organizationSlug,
        projectName,
        userId,
        token
      );

      if (!result.success) {
        return res.status(409).json(result);
      }

      return res.status(201).json(result);
    } catch (error: any) {
      logger.error('Erro ao criar documentação do projeto:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao criar documentação do projeto'
      });
    }
  }

  /**
   * Sincroniza as permissões entre o projeto e sua documentação
   * @param req Request
   * @param res Response
   */
  async syncProjectDocumentationPermissions(req: Request, res: Response) {
    try {
      const { projectId } = req.params;
      const { organizationSlug } = req.params;
      const token = req.headers.authorization?.split(' ')[1] || '';

      if (!projectId || !organizationSlug) {
        return res.status(400).json({
          success: false,
          message: 'ID do projeto e slug da organização são obrigatórios'
        });
      }

      const result = await ProjectDocumentationService.syncProjectDocumentationPermissions(
        projectId,
        organizationSlug,
        token
      );

      if (!result.success) {
        return res.status(404).json(result);
      }

      return res.json(result);
    } catch (error: any) {
      logger.error('Erro ao sincronizar permissões da documentação:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao sincronizar permissões da documentação'
      });
    }
  }
}

export default new DocumentationController(); 