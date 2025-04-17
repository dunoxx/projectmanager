import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

/**
 * API route para obter estatísticas das integrações de documentação
 * GET /api/documentation/statistics
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verificar se o método é GET
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Método não permitido' });
  }

  try {
    // Em um ambiente real, isso faria uma chamada para o serviço de backend
    // Aqui simularemos os dados para demonstração
    
    // Chamar a API do backend para obter as estatísticas
    // const apiResponse = await axios.get(`${process.env.API_URL}/documentation/statistics`);
    // return res.status(200).json(apiResponse.data);

    // Dados simulados para demonstração
    const mockStatistics = {
      success: true,
      data: {
        totalIntegrations: 24,
        documentationsByOrganization: [
          {
            organizationId: 'org-1',
            organizationName: 'Acme Inc',
            organizationSlug: 'acme',
            count: 8
          },
          {
            organizationId: 'org-2',
            organizationName: 'TechCorp',
            organizationSlug: 'techcorp',
            count: 6
          },
          {
            organizationId: 'org-3',
            organizationName: 'DevHub',
            organizationSlug: 'devhub',
            count: 5
          },
          {
            organizationId: 'org-4',
            organizationName: 'InnovateLab',
            organizationSlug: 'innovatelab',
            count: 3
          },
          {
            organizationId: 'org-5',
            organizationName: 'CodeMasters',
            organizationSlug: 'codemasters',
            count: 2
          }
        ],
        recentIntegrations: [
          {
            id: 'int-1',
            projectId: 'proj-101',
            projectName: 'Portal Cliente',
            collectionId: 'coll-101',
            collectionName: 'Portal Cliente - Documentação',
            organizationId: 'org-1',
            organizationName: 'Acme Inc',
            organizationSlug: 'acme',
            createdAt: '2025-04-15T14:32:00Z'
          },
          {
            id: 'int-2',
            projectId: 'proj-102',
            projectName: 'API Gateway',
            collectionId: 'coll-102',
            collectionName: 'API Gateway - Documentação',
            organizationId: 'org-1',
            organizationName: 'Acme Inc',
            organizationSlug: 'acme',
            createdAt: '2025-04-14T09:45:00Z'
          },
          {
            id: 'int-3',
            projectId: 'proj-103',
            projectName: 'Sistema ERP',
            collectionId: 'coll-103',
            collectionName: 'Sistema ERP - Documentação',
            organizationId: 'org-2',
            organizationName: 'TechCorp',
            organizationSlug: 'techcorp',
            createdAt: '2025-04-13T16:20:00Z'
          },
          {
            id: 'int-4',
            projectId: 'proj-104',
            projectName: 'Mobile App',
            collectionId: 'coll-104',
            collectionName: 'Mobile App - Documentação',
            organizationId: 'org-3',
            organizationName: 'DevHub',
            organizationSlug: 'devhub',
            createdAt: '2025-04-12T11:15:00Z'
          },
          {
            id: 'int-5',
            projectId: 'proj-105',
            projectName: 'Data Analytics',
            collectionId: 'coll-105',
            collectionName: 'Data Analytics - Documentação',
            organizationId: 'org-4',
            organizationName: 'InnovateLab',
            organizationSlug: 'innovatelab',
            createdAt: '2025-04-11T13:50:00Z'
          }
        ]
      }
    };

    return res.status(200).json(mockStatistics);
  } catch (error: any) {
    console.error('Erro ao obter estatísticas de documentação:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Erro ao obter estatísticas de documentação',
      error: error.message
    });
  }
} 