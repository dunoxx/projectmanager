import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import ProjectDocumentationService from '../services/ProjectDocumentationService';

/**
 * Controlador responsável por gerenciar webhooks do Plane
 * relacionados a projetos e integrá-los com o Outline
 */
class ProjectWebhookController {
  /**
   * Manipulador para o evento de criação de projeto no Plane
   */
  async handleProjectCreated(req: Request, res: Response): Promise<void> {
    try {
      logger.info('Evento de criação de projeto recebido');
      
      // Extrair dados do webhook
      const { 
        project_id,
        project_name,
        workspace_slug, 
        user_id 
      } = req.body;
      
      // Validar dados recebidos
      if (!project_id || !project_name || !workspace_slug || !user_id) {
        logger.error('Dados incompletos no webhook', req.body);
        res.status(400).json({ error: 'Dados incompletos no webhook' });
        return;
      }
      
      // Verificar autenticação do webhook (em produção, seria necessário verificar um token)
      // if (!this.verifyWebhookSignature(req)) {
      //   logger.error('Webhook inválido - assinatura inválida');
      //   res.status(401).json({ error: 'Assinatura do webhook inválida' });
      //   return;
      // }
      
      logger.info(`Criando collection para o projeto ${project_name} (${project_id})`);
      
      // Criar collection no Outline para o projeto
      const result = await ProjectDocumentationService.createCollectionForProject(
        project_id,
        project_name,
        workspace_slug,
        user_id
      );
      
      if (result) {
        logger.info(`Collection criada com sucesso: ${result.collectionId}`);
        res.status(200).json({
          success: true,
          message: 'Collection criada com sucesso',
          data: {
            project_id,
            collection_id: result.collectionId
          }
        });
      } else {
        logger.error('Falha ao criar collection');
        res.status(500).json({
          success: false,
          message: 'Falha ao criar collection para o projeto'
        });
      }
    } catch (error) {
      logger.error('Erro ao processar webhook de criação de projeto:', error);
      res.status(500).json({ 
        success: false,
        message: 'Erro interno ao processar webhook',
        error: (error as Error).message 
      });
    }
  }
  
  /**
   * Manipulador para o evento de atualização de projeto no Plane
   */
  async handleProjectUpdated(req: Request, res: Response): Promise<void> {
    try {
      logger.info('Evento de atualização de projeto recebido');
      
      const { project_id, workspace_slug } = req.body;
      
      if (!project_id || !workspace_slug) {
        logger.error('Dados incompletos no webhook', req.body);
        res.status(400).json({ error: 'Dados incompletos no webhook' });
        return;
      }
      
      // Atualizar permissões da collection correspondente no Outline
      const permissionsSynced = await ProjectDocumentationService.syncPermissions(
        project_id,
        workspace_slug
      );
      
      if (permissionsSynced) {
        logger.info(`Permissões sincronizadas para o projeto ${project_id}`);
        res.status(200).json({
          success: true,
          message: 'Permissões sincronizadas com sucesso'
        });
      } else {
        logger.error('Falha ao sincronizar permissões');
        res.status(500).json({
          success: false,
          message: 'Falha ao sincronizar permissões para o projeto'
        });
      }
    } catch (error) {
      logger.error('Erro ao processar webhook de atualização de projeto:', error);
      res.status(500).json({ 
        success: false,
        message: 'Erro interno ao processar webhook',
        error: (error as Error).message 
      });
    }
  }
  
  /**
   * Manipulador para o evento de exclusão de projeto no Plane
   */
  async handleProjectDeleted(req: Request, res: Response): Promise<void> {
    // Em uma implementação completa, você poderia:
    // 1. Arquivar a collection no Outline (ao invés de excluir, para preservar dados)
    // 2. Atualizar o registro de mapeamento no banco de dados
    // 3. Opcionalmente adicionar um banner indicando que o projeto está arquivado
    
    res.status(200).json({
      success: true,
      message: 'Evento de exclusão de projeto recebido (sem ação)',
      note: 'A collection do Outline não é excluída quando um projeto é excluído, para preservar dados'
    });
  }
  
  /**
   * Verifica a assinatura do webhook (em produção, isso seria implementado com HMAC)
   */
  private verifyWebhookSignature(req: Request): boolean {
    // Implementação simplificada - em produção, verifique a assinatura HMAC
    // const signature = req.headers['x-webhook-signature'];
    // const payload = JSON.stringify(req.body);
    // const expectedSignature = crypto
    //   .createHmac('sha256', process.env.WEBHOOK_SECRET || '')
    //   .update(payload)
    //   .digest('hex');
    // return signature === expectedSignature;
    
    return true; // Simplificado para exemplo
  }
}

export default new ProjectWebhookController(); 