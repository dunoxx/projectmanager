import axios from 'axios';
import { logger } from '../utils/logger';
import prisma from './prisma';
import { IntegrationConfig, OutlineCollection, ApiResponse } from '../types';

// Obtenha URLs das variáveis de ambiente, com fallbacks para ambientes de desenvolvimento
const OUTLINE_API_URL = process.env.OUTLINE_URL || 'http://outline:3001/api';
const PLANE_API_URL = process.env.PLANE_URL || 'http://plane:3000/api';

/**
 * Interface para o mapeamento entre projetos do Plane e collections do Outline
 */
interface ProjectDocumentationMapping {
  id: string;
  projectId: string;
  collectionId: string;
  organizationSlug: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface para estatísticas de documentação
 */
interface DocumentationStatistics {
  totalIntegrations: number;
  documentationsByOrganization: {
    organizationSlug: string;
    count: number;
  }[];
  recentIntegrations: IntegrationConfig[];
}

/**
 * Serviço responsável por gerenciar a integração entre projetos do Plane
 * e coleções de documentação no Outline
 */
class ProjectDocumentationService {
  /**
   * Obtém a documentação associada a um projeto específico
   * @param projectId ID do projeto no Plane
   * @param organizationSlug Slug da organização
   * @param token Token de autenticação
   * @returns Dados da coleção do Outline associada ao projeto
   */
  async getProjectDocumentation(
    projectId: string,
    organizationSlug: string,
    token: string
  ): Promise<ApiResponse<OutlineCollection>> {
    try {
      logger.info(`Buscando integração para projeto ${projectId} na organização ${organizationSlug}`);
      
      // Buscar configuração de integração existente
      const integration = await prisma.integrationConfig.findFirst({
        where: {
          planeProjectId: projectId,
          organizationSlug
        }
      });

      if (!integration) {
        logger.warn(`Integração não encontrada para projeto ${projectId}`);
        return {
          success: false,
          message: 'Documentação não encontrada para este projeto'
        };
      }

      logger.info(`Integração encontrada. Buscando dados da coleção ${integration.outlineCollectionId} no Outline`);
      
      // Buscar dados da coleção no Outline
      const response = await axios.get(
        `${OUTLINE_API_URL}/collections/${integration.outlineCollectionId}`,
        {
          headers: this.getAuthHeaders(token)
        }
      );

      logger.info(`Dados da coleção recuperados com sucesso para o projeto ${projectId}`);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      this.handleApiError('Erro ao buscar documentação do projeto', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao buscar documentação',
        error: process.env.NODE_ENV === 'development' ? error.toString() : undefined
      };
    }
  }

  /**
   * Lista todas as documentações disponíveis para uma organização
   * @param organizationSlug Slug da organização
   * @param token Token de autenticação
   * @returns Lista de documentações da organização
   */
  async getOrganizationDocumentations(
    organizationSlug: string,
    token: string
  ): Promise<ApiResponse<IntegrationConfig[]>> {
    try {
      logger.info(`Buscando integrações para a organização ${organizationSlug}`);
      
      // Buscar todas as configurações de integração para a organização
      const integrations = await prisma.integrationConfig.findMany({
        where: {
          organizationSlug
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      if (!integrations || integrations.length === 0) {
        logger.warn(`Nenhuma integração encontrada para a organização ${organizationSlug}`);
        return {
          success: true,
          data: []
        };
      }

      // Para cada integração, obter detalhes do projeto e coleção
      const documentationsWithDetails = await Promise.all(
        integrations.map(async (integration: IntegrationConfig) => {
          try {
            // Obter detalhes do projeto do Plane
            const projectResponse = await axios.get(
              `${PLANE_API_URL}/workspaces/${organizationSlug}/projects/${integration.planeProjectId}`,
              {
                headers: this.getAuthHeaders(token)
              }
            );

            // Obter detalhes da coleção do Outline
            const collectionResponse = await axios.get(
              `${OUTLINE_API_URL}/collections/${integration.outlineCollectionId}`,
              {
                headers: this.getAuthHeaders(token)
              }
            );

            // Combinar informações
            return {
              ...integration,
              project: projectResponse.data,
              collection: collectionResponse.data
            };
          } catch (error) {
            // Se houver erro, ainda retorna a integração básica
            logger.warn(`Erro ao obter detalhes para integração ${integration.id}:`, error);
            return integration;
          }
        })
      );

      logger.info(`Encontradas ${documentationsWithDetails.length} integrações para a organização ${organizationSlug}`);
      
      return {
        success: true,
        data: documentationsWithDetails
      };
    } catch (error: any) {
      this.handleApiError(`Erro ao listar documentações da organização ${organizationSlug}`, error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao listar documentações da organização',
        error: process.env.NODE_ENV === 'development' ? error.toString() : undefined
      };
    }
  }

  /**
   * Remove a associação entre um projeto e sua documentação
   * @param projectId ID do projeto no Plane
   * @param organizationSlug Slug da organização
   * @param keepOutlineCollection Se deve manter a coleção no Outline
   * @param token Token de autenticação
   * @returns Status da operação
   */
  async unlinkProjectDocumentation(
    projectId: string,
    organizationSlug: string,
    keepOutlineCollection: boolean = false,
    token: string
  ): Promise<ApiResponse<{message: string}>> {
    try {
      logger.info(`Desvinculando documentação do projeto ${projectId} na organização ${organizationSlug}`);

      // Buscar configuração de integração existente
      const integration = await prisma.integrationConfig.findFirst({
        where: {
          planeProjectId: projectId,
          organizationSlug
        }
      });

      if (!integration) {
        logger.warn(`Integração não encontrada para projeto ${projectId}`);
        return {
          success: false,
          message: 'Documentação não encontrada para este projeto'
        };
      }

      const collectionId = integration.outlineCollectionId;

      // Se não for para manter a coleção no Outline, excluir a coleção
      if (!keepOutlineCollection) {
        try {
          logger.info(`Excluindo coleção ${collectionId} no Outline`);
          await axios.delete(
            `${OUTLINE_API_URL}/collections/${collectionId}`,
            {
              headers: this.getAuthHeaders(token)
            }
          );
          logger.info(`Coleção ${collectionId} excluída com sucesso`);
        } catch (error) {
          // Log do erro mas continua o processo
          logger.warn(`Erro ao excluir coleção ${collectionId} no Outline:`, error);
        }
      } else {
        logger.info(`Mantendo coleção ${collectionId} no Outline conforme solicitado`);
      }

      // Excluir a integração do banco de dados
      await prisma.integrationConfig.delete({
        where: {
          id: integration.id
        }
      });

      logger.info(`Integração entre projeto ${projectId} e coleção ${collectionId} removida com sucesso`);

      return {
        success: true,
        data: {
          message: `Documentação desvinculada com sucesso${!keepOutlineCollection ? ' e excluída do Outline' : ''}`
        }
      };
    } catch (error: any) {
      this.handleApiError(`Erro ao desvincular documentação do projeto ${projectId}`, error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao desvincular documentação do projeto',
        error: process.env.NODE_ENV === 'development' ? error.toString() : undefined
      };
    }
  }

  /**
   * Obtém estatísticas sobre a documentação de projetos
   * @param token Token de autenticação
   * @returns Estatísticas sobre documentação de projetos
   */
  async getDocumentationStatistics(
    token: string
  ): Promise<ApiResponse<DocumentationStatistics>> {
    try {
      logger.info('Coletando estatísticas de documentação');

      // Obter todas as integrações
      const integrations = await prisma.integrationConfig.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Calcular estatísticas
      const totalIntegrations = integrations.length;

      // Agrupar por organização
      const organizationCounts = new Map<string, number>();
      integrations.forEach((integration: IntegrationConfig) => {
        const count = organizationCounts.get(integration.organizationSlug) || 0;
        organizationCounts.set(integration.organizationSlug, count + 1);
      });

      const documentationsByOrganization = Array.from(organizationCounts.entries()).map(([organizationSlug, count]) => ({
        organizationSlug,
        count
      }));

      // Obter as integrações mais recentes (últimas 5)
      const recentIntegrations = integrations.slice(0, 5);

      logger.info(`Estatísticas coletadas: ${totalIntegrations} integrações encontradas`);

      return {
        success: true,
        data: {
          totalIntegrations,
          documentationsByOrganization,
          recentIntegrations
        }
      };
    } catch (error: any) {
      this.handleApiError('Erro ao obter estatísticas de documentação', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao obter estatísticas de documentação',
        error: process.env.NODE_ENV === 'development' ? error.toString() : undefined
      };
    }
  }

  /**
   * Cria uma nova coleção de documentação para um projeto
   * @param projectId ID do projeto no Plane
   * @param organizationSlug Slug da organização
   * @param projectName Nome do projeto
   * @param userId ID do usuário que está criando a documentação
   * @param token Token de autenticação
   * @returns Dados da coleção criada e configuração de integração
   */
  async createProjectDocumentation(
    projectId: string,
    organizationSlug: string,
    projectName: string,
    userId: string,
    token: string
  ): Promise<ApiResponse<{collection: OutlineCollection, integration: IntegrationConfig}>> {
    try {
      logger.info(`Verificando integração existente para projeto ${projectId}`);
      
      // Verificar se já existe integração para este projeto
      const existingIntegration = await prisma.integrationConfig.findFirst({
        where: {
          planeProjectId: projectId,
          organizationSlug
        }
      });

      if (existingIntegration) {
        logger.warn(`Projeto ${projectId} já possui documentação associada (collection ID: ${existingIntegration.outlineCollectionId})`);
        return {
          success: false,
          message: 'Este projeto já possui documentação associada'
        };
      }

      logger.info(`Criando nova coleção no Outline para o projeto ${projectId} (${projectName})`);
      
      // Criar uma nova coleção no Outline
      const collectionResponse = await axios.post(
        `${OUTLINE_API_URL}/collections`,
        {
          name: `Documentação: ${projectName}`,
          description: `Documentação oficial do projeto ${projectName}`,
          color: '#4F46E5', // Cor padrão (índigo)
          permission: 'read_write' // Permissão padrão
        },
        {
          headers: this.getAuthHeaders(token)
        }
      );

      const collection = collectionResponse.data;
      logger.info(`Coleção criada com sucesso no Outline (ID: ${collection.id})`);

      // Criar a integração no banco de dados
      const integration = await prisma.integrationConfig.create({
        data: {
          planeProjectId: projectId,
          outlineCollectionId: collection.id,
          organizationSlug,
          syncEnabled: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
      
      logger.info(`Integração registrada no banco de dados para projeto ${projectId} e coleção ${collection.id}`);

      // Criar documento inicial com template básico
      logger.info(`Criando documento inicial de boas-vindas na coleção ${collection.id}`);
      await this.createWelcomeDocument(collection.id, projectName, token);

      return {
        success: true,
        data: {
          collection,
          integration
        }
      };
    } catch (error: any) {
      this.handleApiError('Erro ao criar documentação para o projeto', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao criar documentação',
        error: process.env.NODE_ENV === 'development' ? error.toString() : undefined
      };
    }
  }

  /**
   * Cria um documento de boas-vindas em uma coleção
   * @private
   * @param collectionId ID da coleção
   * @param projectName Nome do projeto
   * @param token Token de autenticação
   */
  private async createWelcomeDocument(
    collectionId: string,
    projectName: string,
    token: string
  ): Promise<void> {
    try {
      await axios.post(
        `${OUTLINE_API_URL}/documents`,
        {
          title: 'Bem-vindo à Documentação',
          text: this.getWelcomeDocumentTemplate(projectName),
          collectionId: collectionId,
          publish: true
        },
        {
          headers: this.getAuthHeaders(token)
        }
      );
      logger.info(`Documento de boas-vindas criado com sucesso na coleção ${collectionId}`);
    } catch (error) {
      logger.warn(`Erro ao criar documento de boas-vindas: ${error}`);
      // Não interrompe o fluxo se falhar a criação do documento
    }
  }

  /**
   * Retorna o conteúdo do documento de boas-vindas
   * @private
   * @param projectName Nome do projeto
   * @returns Template markdown para o documento
   */
  private getWelcomeDocumentTemplate(projectName: string): string {
    return `# Bem-vindo à Documentação do Projeto ${projectName}

Este é o ponto de partida para a documentação do seu projeto. Aqui você pode:

- Descrever a visão geral do projeto
- Adicionar especificações técnicas
- Incluir guias de usuário
- Documentar APIs e integrações

## Próximos Passos

1. Edite este documento para refletir as necessidades do seu projeto
2. Crie documentos adicionais organizados por tópicos
3. Compartilhe a documentação com sua equipe

## Dicas de Uso

- Use **Markdown** para formatar seus documentos
- Organize documentos em hierarquia para fácil navegação
- Mantenha a documentação atualizada com o progresso do projeto
- Inclua exemplos e casos de uso sempre que possível`;
  }

  /**
   * Sincroniza as permissões entre o projeto do Plane e a coleção do Outline
   * @param projectId ID do projeto no Plane
   * @param organizationSlug Slug da organização
   * @param token Token de autenticação
   * @returns Status da sincronização
   */
  async syncProjectDocumentationPermissions(
    projectId: string,
    organizationSlug: string,
    token: string
  ): Promise<ApiResponse<{message: string}>> {
    try {
      logger.info(`Buscando integração para sincronizar permissões do projeto ${projectId}`);
      
      // Buscar configuração de integração existente
      const integration = await prisma.integrationConfig.findFirst({
        where: {
          planeProjectId: projectId,
          organizationSlug
        }
      });

      if (!integration) {
        logger.warn(`Integração não encontrada para projeto ${projectId} ao tentar sincronizar permissões`);
        return {
          success: false,
          message: 'Documentação não encontrada para este projeto'
        };
      }

      logger.info(`Buscando membros do projeto ${projectId} no Plane`);
      
      // Buscar membros do projeto no Plane
      const membersResponse = await axios.get(
        `${PLANE_API_URL}/workspaces/${organizationSlug}/projects/${projectId}/members`,
        {
          headers: this.getAuthHeaders(token)
        }
      );

      const projectMembers = membersResponse.data;
      logger.info(`Encontrados ${projectMembers.length} membros no projeto ${projectId}`);

      // Atualizar permissões na coleção do Outline para cada membro
      logger.info(`Sincronizando permissões para ${projectMembers.length} membros na coleção ${integration.outlineCollectionId}`);
      
      for (const member of projectMembers) {
        const permission = this.mapPlaneRoleToOutlinePermission(member.role);
        logger.debug(`Sincronizando usuário ${member.userId} com permissão ${permission}`);
        
        try {
          await axios.post(
            `${OUTLINE_API_URL}/collections/${integration.outlineCollectionId}/memberships`,
            {
              userId: member.userId,
              permission: permission
            },
            {
              headers: this.getAuthHeaders(token)
            }
          );
        } catch (memberError) {
          // Log do erro mas continua com os próximos membros
          logger.warn(`Erro ao sincronizar permissões para usuário ${member.userId}: ${memberError}`);
        }
      }

      logger.info(`Permissões sincronizadas com sucesso para projeto ${projectId}`);
      
      return {
        success: true,
        data: {
          message: 'Permissões sincronizadas com sucesso'
        }
      };
    } catch (error: any) {
      this.handleApiError('Erro ao sincronizar permissões', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao sincronizar permissões',
        error: process.env.NODE_ENV === 'development' ? error.toString() : undefined
      };
    }
  }

  /**
   * Mapeia o papel do usuário no Plane para a permissão correspondente no Outline
   * @private
   * @param planeRole Papel do usuário no Plane
   * @returns Permissão correspondente no Outline
   */
  private mapPlaneRoleToOutlinePermission(planeRole: string): string {
    switch (planeRole) {
      case 'admin':
        return 'read_write';
      case 'member':
        return 'read_write';
      case 'viewer':
        return 'read';
      default:
        return 'read';
    }
  }

  /**
   * Retorna cabeçalhos de autenticação padronizados para requisições
   * @private
   * @param token Token de autenticação
   * @returns Objeto com cabeçalhos para requisições API
   */
  private getAuthHeaders(token: string): Record<string, string> {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Trata e registra erros de API de forma padronizada
   * @private
   * @param message Mensagem descritiva do erro
   * @param error Objeto do erro
   */
  private handleApiError(message: string, error: any): void {
    if (error.response) {
      // Erro com resposta do servidor
      logger.error(`${message}: [${error.response.status}] ${error.response.data?.message || error.message}`);
      if (process.env.NODE_ENV === 'development') {
        logger.debug(`Dados da resposta: ${JSON.stringify(error.response.data)}`);
      }
    } else if (error.request) {
      // Erro sem resposta do servidor
      logger.error(`${message}: Sem resposta do servidor - ${error.message}`);
    } else {
      // Erro inesperado
      logger.error(`${message}: ${error.message}`);
    }
  }

  /**
   * Cria uma coleção no Outline para um projeto (interface simplificada para webhooks)
   * @param projectId ID do projeto
   * @param projectName Nome do projeto
   * @param organizationSlug Slug da organização
   * @param userId ID do usuário
   * @returns Objeto com ID da coleção criada
   */
  async createCollectionForProject(
    projectId: string,
    projectName: string,
    organizationSlug: string,
    userId: string
  ): Promise<{collectionId: string} | null> {
    try {
      // Criar token temporário para operação interna
      const internalToken = "sistema-interno-token";
      
      const result = await this.createProjectDocumentation(
        projectId,
        organizationSlug,
        projectName,
        userId,
        internalToken
      );
      
      if (result.success && result.data) {
        return {
          collectionId: result.data.collection.id
        };
      }
      
      return null;
    } catch (error) {
      logger.error('Erro ao criar coleção para projeto:', error);
      return null;
    }
  }

  /**
   * Sincroniza permissões entre projeto e coleção (interface simplificada para webhooks)
   * @param projectId ID do projeto
   * @param organizationSlug Slug da organização
   * @returns Verdadeiro se sincronização foi bem-sucedida
   */
  async syncPermissions(
    projectId: string,
    organizationSlug: string
  ): Promise<boolean> {
    try {
      // Criar token temporário para operação interna
      const internalToken = "sistema-interno-token";
      
      const result = await this.syncProjectDocumentationPermissions(
        projectId,
        organizationSlug,
        internalToken
      );
      
      return result.success;
    } catch (error) {
      logger.error('Erro ao sincronizar permissões:', error);
      return false;
    }
  }

  /**
   * Obtém dados da coleção associada a um projeto
   * @param projectId ID do projeto
   * @param organizationSlug Slug da organização
   * @returns Dados da coleção ou null se não encontrada
   */
  async getProjectCollection(
    projectId: string,
    organizationSlug: string
  ): Promise<OutlineCollection | null> {
    try {
      // Criar token temporário para operação interna
      const internalToken = "sistema-interno-token";
      
      const result = await this.getProjectDocumentation(
        projectId,
        organizationSlug,
        internalToken
      );
      
      if (result.success && result.data) {
        return result.data;
      }
      
      return null;
    } catch (error) {
      logger.error('Erro ao obter coleção do projeto:', error);
      return null;
    }
  }
}

export default new ProjectDocumentationService(); 