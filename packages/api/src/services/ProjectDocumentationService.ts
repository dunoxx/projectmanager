import axios from 'axios';
import { logger } from '../utils/logger';
import prisma from './prisma';
import { IntegrationConfig, OutlineCollection, ApiResponse } from '../types';

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
      // Buscar configuração de integração existente
      const integration = await prisma.integrationConfig.findFirst({
        where: {
          planeProjectId: projectId,
          organizationSlug
        }
      });

      if (!integration) {
        return {
          success: false,
          message: 'Documentação não encontrada para este projeto'
        };
      }

      // Buscar dados da coleção no Outline
      const response = await axios.get(
        `${OUTLINE_API_URL}/collections/${integration.outlineCollectionId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      logger.error('Erro ao buscar documentação do projeto:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao buscar documentação'
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
      // Verificar se já existe integração para este projeto
      const existingIntegration = await prisma.integrationConfig.findFirst({
        where: {
          planeProjectId: projectId,
          organizationSlug
        }
      });

      if (existingIntegration) {
        return {
          success: false,
          message: 'Este projeto já possui documentação associada'
        };
      }

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
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const collection = collectionResponse.data;

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

      // Criar documento inicial com template básico
      await axios.post(
        `${OUTLINE_API_URL}/documents`,
        {
          title: 'Bem-vindo à Documentação',
          text: `# Bem-vindo à Documentação do Projeto ${projectName}\n\nEste é o ponto de partida para a documentação do seu projeto. Aqui você pode:\n\n- Descrever a visão geral do projeto\n- Adicionar especificações técnicas\n- Incluir guias de usuário\n- Documentar APIs e integrações\n\n## Próximos Passos\n\n1. Edite este documento para refletir as necessidades do seu projeto\n2. Crie documentos adicionais organizados por tópicos\n3. Compartilhe a documentação com sua equipe`,
          collectionId: collection.id,
          publish: true
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        data: {
          collection,
          integration
        }
      };
    } catch (error: any) {
      logger.error('Erro ao criar documentação para o projeto:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao criar documentação'
      };
    }
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
      // Buscar configuração de integração existente
      const integration = await prisma.integrationConfig.findFirst({
        where: {
          planeProjectId: projectId,
          organizationSlug
        }
      });

      if (!integration) {
        return {
          success: false,
          message: 'Documentação não encontrada para este projeto'
        };
      }

      // Buscar membros do projeto no Plane
      const membersResponse = await axios.get(
        `${PLANE_API_URL}/workspaces/${organizationSlug}/projects/${projectId}/members`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const projectMembers = membersResponse.data;

      // Atualizar permissões na coleção do Outline para cada membro
      // Nota: Esta implementação varia conforme a API do Outline
      // Este é um exemplo simplificado
      for (const member of projectMembers) {
        await axios.post(
          `${OUTLINE_API_URL}/collections/${integration.outlineCollectionId}/memberships`,
          {
            userId: member.userId,
            permission: this.mapPlaneRoleToOutlinePermission(member.role)
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      return {
        success: true,
        data: {
          message: 'Permissões sincronizadas com sucesso'
        }
      };
    } catch (error: any) {
      logger.error('Erro ao sincronizar permissões:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao sincronizar permissões'
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