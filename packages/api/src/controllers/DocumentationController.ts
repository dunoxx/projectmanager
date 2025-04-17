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
   * @param req Request - Contém parâmetros como projectId e organizationSlug
   * @param res Response - Retorna dados da documentação ou mensagem de erro
   */
  async getProjectDocumentation(req: Request, res: Response) {
    try {
      const { projectId, organizationSlug } = req.params;
      const token = req.headers.authorization?.split(' ')[1] || '';

      // Validação de parâmetros obrigatórios
      if (!projectId || !organizationSlug) {
        logger.warn('Requisição para obter documentação sem projectId ou organizationSlug');
        return res.status(400).json({
          success: false,
          message: 'ID do projeto e slug da organização são obrigatórios'
        });
      }

      logger.info(`Buscando documentação para projeto ${projectId} na organização ${organizationSlug}`);
      
      const result = await ProjectDocumentationService.getProjectDocumentation(
        projectId,
        organizationSlug,
        token
      );

      if (!result.success) {
        logger.warn(`Documentação não encontrada para o projeto ${projectId}: ${result.message}`);
        return res.status(404).json(result);
      }

      logger.info(`Documentação encontrada com sucesso para o projeto ${projectId}`);
      return res.json(result);
    } catch (error: any) {
      logger.error('Erro ao obter documentação do projeto:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao obter documentação do projeto',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Cria uma nova documentação para um projeto
   * @param req Request - Contém dados do projeto e informações de autenticação
   * @param res Response - Retorna dados da documentação criada ou mensagem de erro
   */
  async createProjectDocumentation(req: Request, res: Response) {
    try {
      const { projectId, organizationSlug } = req.params;
      const { projectName } = req.body;
      const userId = req.user?.id || '';
      const token = req.headers.authorization?.split(' ')[1] || '';

      // Validação de dados obrigatórios
      if (!projectId || !organizationSlug || !projectName) {
        logger.warn('Requisição para criar documentação com dados incompletos');
        return res.status(400).json({
          success: false,
          message: 'ID do projeto, slug da organização e nome do projeto são obrigatórios'
        });
      }

      if (!userId) {
        logger.warn('Tentativa de criar documentação sem ID de usuário válido');
        return res.status(401).json({
          success: false,
          message: 'ID de usuário não encontrado. Autenticação necessária.'
        });
      }

      logger.info(`Criando documentação para projeto ${projectId} (${projectName}) na organização ${organizationSlug}`);
      
      const result = await ProjectDocumentationService.createProjectDocumentation(
        projectId,
        organizationSlug,
        projectName,
        userId,
        token
      );

      if (!result.success) {
        logger.warn(`Falha ao criar documentação para o projeto ${projectId}: ${result.message}`);
        return res.status(409).json(result);
      }

      logger.info(`Documentação criada com sucesso para o projeto ${projectId}`);
      return res.status(201).json(result);
    } catch (error: any) {
      logger.error('Erro ao criar documentação do projeto:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao criar documentação do projeto',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Sincroniza as permissões entre o projeto e sua documentação
   * @param req Request - Contém ID do projeto e slug da organização
   * @param res Response - Retorna status da sincronização ou mensagem de erro
   */
  async syncProjectDocumentationPermissions(req: Request, res: Response) {
    try {
      const { projectId, organizationSlug } = req.params;
      const token = req.headers.authorization?.split(' ')[1] || '';

      // Validação de parâmetros obrigatórios
      if (!projectId || !organizationSlug) {
        logger.warn('Requisição para sincronizar permissões sem projectId ou organizationSlug');
        return res.status(400).json({
          success: false,
          message: 'ID do projeto e slug da organização são obrigatórios'
        });
      }

      logger.info(`Sincronizando permissões para projeto ${projectId} na organização ${organizationSlug}`);
      
      const result = await ProjectDocumentationService.syncProjectDocumentationPermissions(
        projectId,
        organizationSlug,
        token
      );

      if (!result.success) {
        logger.warn(`Falha na sincronização de permissões para o projeto ${projectId}: ${result.message}`);
        return res.status(404).json(result);
      }

      logger.info(`Permissões sincronizadas com sucesso para o projeto ${projectId}`);
      return res.json(result);
    } catch (error: any) {
      logger.error('Erro ao sincronizar permissões da documentação:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao sincronizar permissões da documentação',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Lista todas as documentações disponíveis para uma organização
   * @param req Request - Contém slug da organização
   * @param res Response - Retorna lista de documentações ou mensagem de erro
   */
  async getOrganizationDocumentations(req: Request, res: Response) {
    try {
      const { organizationSlug } = req.params;
      const token = req.headers.authorization?.split(' ')[1] || '';

      if (!organizationSlug) {
        logger.warn('Requisição para listar documentações sem organizationSlug');
        return res.status(400).json({
          success: false,
          message: 'Slug da organização é obrigatório'
        });
      }

      logger.info(`Listando documentações para a organização ${organizationSlug}`);
      
      // Obtenha as documentações da organização
      const result = await ProjectDocumentationService.getOrganizationDocumentations(
        organizationSlug,
        token
      );

      if (!result.success) {
        logger.warn(`Falha ao listar documentações para a organização ${organizationSlug}: ${result.message}`);
        return res.status(404).json(result);
      }

      logger.info(`Documentações listadas com sucesso para a organização ${organizationSlug}`);
      return res.json(result);
    } catch (error: any) {
      logger.error('Erro ao listar documentações da organização:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao listar documentações da organização',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Remove a associação entre um projeto e sua documentação
   * @param req Request - Contém ID do projeto e slug da organização
   * @param res Response - Retorna status da operação ou mensagem de erro
   */
  async unlinkProjectDocumentation(req: Request, res: Response) {
    try {
      const { projectId, organizationSlug } = req.params;
      const token = req.headers.authorization?.split(' ')[1] || '';
      const { keepOutlineCollection } = req.query;
      
      // Validação dos parâmetros obrigatórios
      if (!projectId || !organizationSlug) {
        logger.warn('Requisição para desvincular documentação sem projectId ou organizationSlug');
        return res.status(400).json({
          success: false,
          message: 'ID do projeto e slug da organização são obrigatórios'
        });
      }

      logger.info(`Desvinculando documentação do projeto ${projectId} na organização ${organizationSlug}`);
      
      // Chama o serviço para desvincular a documentação
      const result = await ProjectDocumentationService.unlinkProjectDocumentation(
        projectId, 
        organizationSlug,
        Boolean(keepOutlineCollection),
        token
      );

      if (!result.success) {
        logger.warn(`Falha ao desvincular documentação do projeto ${projectId}: ${result.message}`);
        return res.status(404).json(result);
      }

      logger.info(`Documentação desvinculada com sucesso do projeto ${projectId}`);
      return res.json(result);
    } catch (error: any) {
      logger.error('Erro ao desvincular documentação do projeto:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao desvincular documentação do projeto',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Obtém estatísticas sobre a documentação de projetos
   * @param req Request
   * @param res Response - Retorna estatísticas sobre documentação ou mensagem de erro
   */
  async getDocumentationStatistics(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(' ')[1] || '';
      
      logger.info('Obtendo estatísticas de documentação');
      
      // Chama o serviço para obter estatísticas
      const result = await ProjectDocumentationService.getDocumentationStatistics(token);

      if (!result.success) {
        logger.warn(`Falha ao obter estatísticas de documentação: ${result.message}`);
        return res.status(500).json(result);
      }

      logger.info('Estatísticas de documentação obtidas com sucesso');
      return res.json(result);
    } catch (error: any) {
      logger.error('Erro ao obter estatísticas de documentação:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao obter estatísticas de documentação',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

export default new DocumentationController(); 