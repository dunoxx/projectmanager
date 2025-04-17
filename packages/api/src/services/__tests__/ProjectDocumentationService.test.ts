import ProjectDocumentationService from '../ProjectDocumentationService';
import prisma from '../prisma';
import axios from 'axios';

// Mock do prisma
jest.mock('../prisma', () => ({
  integrationConfig: {
    findFirst: jest.fn(),
    create: jest.fn()
  }
}));

// Mock do axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ProjectDocumentationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProjectDocumentation', () => {
    it('deve retornar a documentação quando ela existir', async () => {
      // Configurar mocks
      const mockIntegration = {
        id: 'int_123',
        planeProjectId: 'proj_123',
        outlineCollectionId: 'col_123',
        organizationSlug: 'acme',
        syncEnabled: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const mockCollection = {
        id: 'col_123',
        name: 'Documentação: Projeto Teste',
        description: 'Documentação do projeto',
        color: '#4F46E5'
      };

      (prisma.integrationConfig.findFirst as jest.Mock).mockResolvedValue(mockIntegration);
      mockedAxios.get.mockResolvedValue({ data: mockCollection });

      // Chamar o serviço
      const result = await ProjectDocumentationService.getProjectDocumentation(
        'proj_123',
        'acme',
        'token_123'
      );

      // Verificar resultado
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockCollection);

      // Verificar se as funções foram chamadas corretamente
      expect(prisma.integrationConfig.findFirst).toHaveBeenCalledWith({
        where: {
          planeProjectId: 'proj_123',
          organizationSlug: 'acme'
        }
      });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/collections/col_123'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer token_123'
          })
        })
      );
    });

    it('deve retornar erro quando a documentação não existir', async () => {
      // Configurar mock para retornar null
      (prisma.integrationConfig.findFirst as jest.Mock).mockResolvedValue(null);

      // Chamar o serviço
      const result = await ProjectDocumentationService.getProjectDocumentation(
        'proj_456',
        'acme',
        'token_123'
      );

      // Verificar resultado
      expect(result.success).toBe(false);
      expect(result.message).toContain('não encontrada');
    });
  });

  describe('createProjectDocumentation', () => {
    it('deve criar uma nova documentação para o projeto', async () => {
      // Configurar mocks
      (prisma.integrationConfig.findFirst as jest.Mock).mockResolvedValue(null);

      const mockCollection = {
        id: 'col_new',
        name: 'Documentação: Projeto Teste',
        description: 'Documentação oficial do projeto Projeto Teste'
      };

      const mockIntegration = {
        id: 'int_new',
        planeProjectId: 'proj_new',
        outlineCollectionId: 'col_new',
        organizationSlug: 'acme',
        syncEnabled: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockedAxios.post.mockImplementation((url) => {
        if (url.includes('/collections')) {
          return Promise.resolve({ data: mockCollection });
        } else {
          return Promise.resolve({ data: { success: true } });
        }
      });

      (prisma.integrationConfig.create as jest.Mock).mockResolvedValue(mockIntegration);

      // Chamar o serviço
      const result = await ProjectDocumentationService.createProjectDocumentation(
        'proj_new',
        'acme',
        'Projeto Teste',
        'user_123',
        'token_123'
      );

      // Verificar resultado
      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        collection: mockCollection,
        integration: mockIntegration
      });

      // Verificar se as funções foram chamadas corretamente
      expect(prisma.integrationConfig.findFirst).toHaveBeenCalledWith({
        where: {
          planeProjectId: 'proj_new',
          organizationSlug: 'acme'
        }
      });

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/collections'),
        expect.objectContaining({
          name: 'Documentação: Projeto Teste'
        }),
        expect.any(Object)
      );

      expect(prisma.integrationConfig.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          planeProjectId: 'proj_new',
          outlineCollectionId: mockCollection.id,
          organizationSlug: 'acme',
          syncEnabled: true
        })
      });
    });

    it('deve retornar erro quando já existir documentação para o projeto', async () => {
      // Configurar mock para retornar uma integração existente
      const existingIntegration = {
        id: 'int_123',
        planeProjectId: 'proj_123',
        outlineCollectionId: 'col_123',
        organizationSlug: 'acme',
        syncEnabled: true
      };

      (prisma.integrationConfig.findFirst as jest.Mock).mockResolvedValue(existingIntegration);

      // Chamar o serviço
      const result = await ProjectDocumentationService.createProjectDocumentation(
        'proj_123',
        'acme',
        'Projeto Existente',
        'user_123',
        'token_123'
      );

      // Verificar resultado
      expect(result.success).toBe(false);
      expect(result.message).toContain('já possui documentação');
    });
  });

  describe('syncProjectDocumentationPermissions', () => {
    it('deve sincronizar permissões com sucesso', async () => {
      // Configurar mocks
      const mockIntegration = {
        id: 'int_123',
        planeProjectId: 'proj_123',
        outlineCollectionId: 'col_123',
        organizationSlug: 'acme',
        syncEnabled: true
      };

      const mockMembers = [
        { userId: 'user_1', role: 'admin' },
        { userId: 'user_2', role: 'member' },
        { userId: 'user_3', role: 'viewer' }
      ];

      (prisma.integrationConfig.findFirst as jest.Mock).mockResolvedValue(mockIntegration);
      mockedAxios.get.mockResolvedValue({ data: mockMembers });
      mockedAxios.post.mockResolvedValue({ data: { success: true } });

      // Chamar o serviço
      const result = await ProjectDocumentationService.syncProjectDocumentationPermissions(
        'proj_123',
        'acme',
        'token_123'
      );

      // Verificar resultado
      expect(result.success).toBe(true);
      expect(result.data?.message).toContain('sincronizadas com sucesso');

      // Verificar se as funções foram chamadas corretamente
      expect(prisma.integrationConfig.findFirst).toHaveBeenCalledWith({
        where: {
          planeProjectId: 'proj_123',
          organizationSlug: 'acme'
        }
      });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/projects/proj_123/members'),
        expect.any(Object)
      );

      // Verificar se foram feitas 3 chamadas para sincronizar permissões (uma para cada membro)
      expect(mockedAxios.post).toHaveBeenCalledTimes(3);
    });

    it('deve retornar erro quando não existir documentação para o projeto', async () => {
      // Configurar mock para retornar null
      (prisma.integrationConfig.findFirst as jest.Mock).mockResolvedValue(null);

      // Chamar o serviço
      const result = await ProjectDocumentationService.syncProjectDocumentationPermissions(
        'proj_456',
        'acme',
        'token_123'
      );

      // Verificar resultado
      expect(result.success).toBe(false);
      expect(result.message).toContain('não encontrada');
    });
  });
}); 