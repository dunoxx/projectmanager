import axios from 'axios';
import { logger } from '../utils/logger';

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
 * Serviço responsável pela integração entre projetos do Plane e collections do Outline
 */
class ProjectDocumentationService {
  private planeApiUrl: string;
  private outlineApiUrl: string;
  private jwtSecret: string;

  constructor() {
    this.planeApiUrl = process.env.PLANE_URL || 'http://plane:3000';
    this.outlineApiUrl = process.env.OUTLINE_URL || 'http://outline:3001';
    this.jwtSecret = process.env.JWT_SECRET || 'devsecretchangethisinproduction';
  }

  /**
   * Cria uma nova collection no Outline quando um projeto é criado no Plane
   * @param projectId ID do projeto no Plane
   * @param projectName Nome do projeto
   * @param organizationSlug Slug da organização/workspace no Plane
   * @param userId ID do usuário que criou o projeto
   */
  async createCollectionForProject(
    projectId: string,
    projectName: string,
    organizationSlug: string,
    userId: string
  ): Promise<ProjectDocumentationMapping | null> {
    try {
      logger.info(`Criando collection no Outline para o projeto ${projectName} (${projectId})`);

      // 1. Buscar detalhes do projeto no Plane para garantir que existe
      const projectDetails = await this.getProjectDetails(projectId, organizationSlug);
      if (!projectDetails) {
        throw new Error(`Projeto ${projectId} não encontrado`);
      }

      // 2. Criar uma nova collection no Outline
      const collectionData = {
        name: `${projectName} Docs`,
        description: `Documentação para o projeto ${projectName}`,
        color: projectDetails.color || '#4F46E5',
        private: true,
        permission: 'read_write',
        // Metadados adicionais para vincular à estrutura do Plane
        metadata: {
          planeProjectId: projectId,
          planeOrganizationSlug: organizationSlug
        }
      };

      const collectionResponse = await axios.post(
        `${this.outlineApiUrl}/api/collections`,
        collectionData,
        {
          headers: {
            Authorization: `Bearer ${this.generateServiceToken(userId)}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const collectionId = collectionResponse.data.id;

      // 3. Salvar o mapeamento entre o projeto e a collection
      const mapping = await this.saveProjectCollectionMapping(
        projectId,
        collectionId,
        organizationSlug
      );

      // 4. Criar documento inicial de boas-vindas na collection
      await this.createWelcomeDocument(collectionId, projectName, userId);

      logger.info(`Collection ${collectionId} criada com sucesso para o projeto ${projectId}`);
      return mapping;
    } catch (error) {
      logger.error('Erro ao criar collection para o projeto:', error);
      return null;
    }
  }

  /**
   * Busca detalhes de um projeto no Plane
   */
  private async getProjectDetails(projectId: string, organizationSlug: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.planeApiUrl}/api/workspaces/${organizationSlug}/projects/${projectId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            // Usando autenticação de serviço interno
            'X-Service-Token': this.generateInternalServiceToken()
          }
        }
      );
      return response.data;
    } catch (error) {
      logger.error('Erro ao buscar detalhes do projeto:', error);
      return null;
    }
  }

  /**
   * Salva o mapeamento entre projeto e collection no banco de dados
   */
  private async saveProjectCollectionMapping(
    projectId: string,
    collectionId: string,
    organizationSlug: string
  ): Promise<ProjectDocumentationMapping> {
    // Aqui, você usaria seu ORM/banco de dados para salvar o registro
    // Este é um exemplo simplificado, sem persistência real
    const mapping: ProjectDocumentationMapping = {
      id: `map_${Date.now()}`,
      projectId,
      collectionId,
      organizationSlug,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Em uma implementação real:
    // return await db.projectDocumentationMappings.create(mapping);

    return mapping;
  }

  /**
   * Cria um documento inicial de boas-vindas na collection
   */
  private async createWelcomeDocument(
    collectionId: string,
    projectName: string,
    userId: string
  ): Promise<void> {
    try {
      const welcomeDocData = {
        title: 'Bem-vindo à Documentação',
        text: `# Bem-vindo à Documentação do ${projectName}

Esta é a área de documentação do seu projeto. Aqui você pode:

- Criar e organizar documentos
- Colaborar com sua equipe
- Manter toda a documentação do projeto centralizada

## Começando

1. Crie documentos para especificações, requisitos ou guias
2. Organize-os em uma estrutura lógica
3. Compartilhe com sua equipe

Boa documentação!`,
        collectionId,
        publish: true
      };

      await axios.post(`${this.outlineApiUrl}/api/documents`, welcomeDocData, {
        headers: {
          Authorization: `Bearer ${this.generateServiceToken(userId)}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      logger.error('Erro ao criar documento de boas-vindas:', error);
    }
  }

  /**
   * Gera um token JWT para autenticação de serviço
   */
  private generateServiceToken(userId: string): string {
    // Em uma implementação real, você usaria uma biblioteca JWT
    // para assinar um token com o userId e outras claims
    
    // Exemplo simplificado, sem implementação real:
    return `dummy_token_for_user_${userId}`;
    
    // Implementação real seria algo como:
    // return jwt.sign({ userId, serviceRequest: true }, this.jwtSecret, { expiresIn: '1h' });
  }

  /**
   * Gera um token para comunicação interna entre serviços
   */
  private generateInternalServiceToken(): string {
    // Token para comunicação entre serviços
    return `internal_service_token`;
    
    // Implementação real seria algo como:
    // return jwt.sign({ service: 'api-integration', internal: true }, this.jwtSecret, { expiresIn: '1h' });
  }

  /**
   * Busca a collection do Outline associada a um projeto
   */
  async getProjectCollection(projectId: string, organizationSlug: string): Promise<any> {
    try {
      // Em uma implementação real, você buscaria isso do banco de dados
      // const mapping = await db.projectDocumentationMappings.findOne({
      //   where: { projectId, organizationSlug }
      // });
      
      // Simulação:
      const mapping = { collectionId: null };

      if (!mapping || !mapping.collectionId) {
        return null;
      }

      // Buscar os detalhes da collection no Outline
      const response = await axios.get(
        `${this.outlineApiUrl}/api/collections/${mapping.collectionId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Service-Token': this.generateInternalServiceToken()
          }
        }
      );

      return response.data;
    } catch (error) {
      logger.error('Erro ao buscar collection do projeto:', error);
      return null;
    }
  }

  /**
   * Sincroniza permissões entre o projeto do Plane e a collection do Outline
   */
  async syncPermissions(
    projectId: string,
    organizationSlug: string
  ): Promise<boolean> {
    try {
      // 1. Buscar permissões do projeto no Plane
      const planePermissions = await this.getProjectPermissions(projectId, organizationSlug);
      if (!planePermissions) {
        throw new Error('Não foi possível obter permissões do projeto');
      }

      // 2. Buscar mapeamento do projeto para collection
      // Em uma implementação real, você buscaria isso do banco de dados
      // const mapping = await db.projectDocumentationMappings.findOne({
      //   where: { projectId, organizationSlug }
      // });
      
      // Simulação:
      const mapping = { collectionId: null };

      if (!mapping || !mapping.collectionId) {
        throw new Error('Mapeamento projeto-collection não encontrado');
      }

      // 3. Para cada permissão no Plane, mapear para o Outline
      for (const permission of planePermissions) {
        const outlinePermission = this.mapPlaneRoleToOutlinePermission(permission.role);
        
        // 4. Atualizar permissão no Outline
        await axios.post(
          `${this.outlineApiUrl}/api/collections.memberships`,
          {
            collectionId: mapping.collectionId,
            userId: permission.userId,
            permission: outlinePermission
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Service-Token': this.generateInternalServiceToken()
            }
          }
        );
      }

      logger.info(`Permissões sincronizadas com sucesso para o projeto ${projectId}`);
      return true;
    } catch (error) {
      logger.error('Erro ao sincronizar permissões:', error);
      return false;
    }
  }

  /**
   * Busca permissões de um projeto no Plane
   */
  private async getProjectPermissions(projectId: string, organizationSlug: string): Promise<any[]> {
    try {
      const response = await axios.get(
        `${this.planeApiUrl}/api/workspaces/${organizationSlug}/projects/${projectId}/members`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Service-Token': this.generateInternalServiceToken()
          }
        }
      );
      return response.data;
    } catch (error) {
      logger.error('Erro ao buscar permissões do projeto:', error);
      return [];
    }
  }

  /**
   * Mapeia um papel (role) do Plane para uma permissão do Outline
   */
  private mapPlaneRoleToOutlinePermission(planeRole: string): string {
    // Mapeamento de papéis do Plane para permissões do Outline
    const roleMapping: Record<string, string> = {
      'Admin': 'admin',
      'Member': 'read_write',
      'Viewer': 'read',
      'Owner': 'admin',
      'Guest': 'read'
    };

    return roleMapping[planeRole] || 'read';
  }
}

export default new ProjectDocumentationService(); 