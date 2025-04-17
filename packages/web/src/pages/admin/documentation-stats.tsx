import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from 'axios';
import PageLayout from '../../components/layouts/PageLayout';
import { Spinner, Alert } from '../../components/ui';

// Interface para os dados de estatísticas
interface DocumentationStatistics {
  totalIntegrations: number;
  documentationsByOrganization: {
    organizationId: string;
    organizationName: string;
    organizationSlug: string;
    count: number;
  }[];
  recentIntegrations: {
    id: string;
    projectId: string;
    projectName: string;
    collectionId: string;
    collectionName: string;
    organizationId: string;
    organizationName: string;
    organizationSlug: string;
    createdAt: string;
  }[];
}

/**
 * Página de estatísticas das documentações de projetos
 * Esta página é acessível apenas para administradores
 */
const DocumentationStatsPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DocumentationStatistics | null>(null);

  // Carregar estatísticas
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/documentation/statistics');
        
        if (response.data.success) {
          setStats(response.data.data);
        } else {
          throw new Error(response.data.message || 'Falha ao carregar estatísticas');
        }
      } catch (error: any) {
        console.error('Erro ao carregar estatísticas:', error);
        setError(error.message || 'Não foi possível carregar as estatísticas. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Se estiver carregando, mostrar spinner
  if (loading) {
    return (
      <PageLayout title="Estatísticas de Documentação">
        <div className="flex items-center justify-center h-96">
          <Spinner size="lg" />
        </div>
      </PageLayout>
    );
  }

  // Se houver erro, mostrar mensagem
  if (error) {
    return (
      <PageLayout title="Estatísticas de Documentação">
        <Alert 
          variant="destructive" 
          title="Erro ao carregar estatísticas" 
          description={error}
        />
      </PageLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Estatísticas de Documentação | Project Manager</title>
      </Head>
      <PageLayout 
        title="Estatísticas de Documentação" 
        description="Visão geral das integrações entre projetos e suas documentações"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Estatísticas de Documentação', href: '/admin/documentation-stats' },
        ]}
      >
        {stats && (
          <div className="space-y-8">
            {/* Visão geral */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4">Visão Geral</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-800 mb-1">Total de Integrações</h3>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalIntegrations}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-green-800 mb-1">Organizações com Documentação</h3>
                  <p className="text-3xl font-bold text-green-600">{stats.documentationsByOrganization.length}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-purple-800 mb-1">Integrações Recentes</h3>
                  <p className="text-3xl font-bold text-purple-600">{stats.recentIntegrations.length}</p>
                </div>
              </div>
            </div>

            {/* Integrações por organização */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4">Documentações por Organização</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Organização
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Slug
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantidade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.documentationsByOrganization.map((org) => (
                      <tr key={org.organizationId}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{org.organizationName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{org.organizationSlug}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{org.count}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => router.push(`/org/${org.organizationSlug}`)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Ver Organização
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Integrações recentes */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4">Integrações Recentes</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Projeto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Organização
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Coleção
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data de Criação
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.recentIntegrations.map((integration) => (
                      <tr key={integration.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{integration.projectName}</div>
                          <div className="text-xs text-gray-500">{integration.projectId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{integration.organizationName}</div>
                          <div className="text-xs text-gray-500">{integration.organizationSlug}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{integration.collectionName}</div>
                          <div className="text-xs text-gray-500">{integration.collectionId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{formatDate(integration.createdAt)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => router.push(`/org/${integration.organizationSlug}/project/${integration.projectId}/docs`)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Ver Documentação
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </PageLayout>
    </>
  );
};

export default DocumentationStatsPage; 