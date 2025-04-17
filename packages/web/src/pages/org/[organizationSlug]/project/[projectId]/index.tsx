import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import PageLayout from '../../../../../components/layouts/PageLayout';
import { Spinner } from '../../../../../components/ui';
import axios from 'axios';

interface Project {
  id: string;
  name: string;
  slug: string;
  description?: string;
  hasDocumentation?: boolean;
}

/**
 * Página principal do projeto com navegação por abas
 */
const ProjectPage: React.FC = () => {
  const router = useRouter();
  const { organizationSlug, projectId } = router.query;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Carregar dados do projeto
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId || !organizationSlug) return;

      try {
        setLoading(true);
        const response = await axios.get(`/api/projects/${projectId}`);
        
        if (response.data.success) {
          const projectData = response.data.data;
          
          // Verificar se o projeto tem documentação
          try {
            const docResponse = await axios.get(
              `/api/documentation/${organizationSlug}/projects/${projectId}`
            );
            projectData.hasDocumentation = docResponse.data.success;
          } catch (error) {
            projectData.hasDocumentation = false;
          }
          
          setProject(projectData);
        }
      } catch (error) {
        console.error('Erro ao carregar projeto:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, organizationSlug]);

  // Mapear as abas do projeto
  const tabs = [
    { id: 'overview', label: 'Visão Geral', href: `/org/${organizationSlug}/project/${projectId}` },
    { id: 'tasks', label: 'Tarefas', href: `/org/${organizationSlug}/project/${projectId}/tasks` },
    { id: 'docs', label: '📄 Documentação', href: `/org/${organizationSlug}/project/${projectId}/docs` },
    { id: 'settings', label: 'Configurações', href: `/org/${organizationSlug}/project/${projectId}/settings` },
  ];

  if (loading) {
    return (
      <PageLayout title="Carregando...">
        <div className="flex items-center justify-center h-96">
          <Spinner size="lg" />
        </div>
      </PageLayout>
    );
  }

  if (!project) {
    return (
      <PageLayout title="Projeto não encontrado">
        <div className="flex flex-col items-center justify-center h-96">
          <h2 className="text-xl font-semibold mb-4">Projeto não encontrado</h2>
          <p className="text-gray-600 mb-6">
            O projeto solicitado não existe ou você não tem permissão para acessá-lo.
          </p>
          <Link 
            href={`/org/${organizationSlug}/projects`}
            className="px-4 py-2 bg-primary text-white rounded-md shadow-sm"
          >
            Voltar para Projetos
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <>
      <Head>
        <title>{project.name} | Project Manager</title>
      </Head>
      <PageLayout 
        title={project.name}
        description={project.description}
        breadcrumbs={[
          { label: 'Organizações', href: '/organizations' },
          { label: organizationSlug as string, href: `/org/${organizationSlug}` },
          { label: 'Projetos', href: `/org/${organizationSlug}/projects` },
          { label: project.name, href: `/org/${organizationSlug}/project/${projectId}` },
        ]}
      >
        {/* Navegação por abas */}
        <div className="mb-8 border-b">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={tab.href}
                className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Conteúdo da aba atual - Para a página principal, mostramos a visão geral */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Visão Geral do Projeto</h2>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-lg mb-2">Detalhes</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-gray-500">ID:</div>
                <div>{project.id}</div>
                <div className="text-gray-500">Slug:</div>
                <div>{project.slug}</div>
                <div className="text-gray-500">Documentação:</div>
                <div>
                  {project.hasDocumentation ? (
                    <span className="inline-flex items-center bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Configurada
                    </span>
                  ) : (
                    <span className="inline-flex items-center bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                      Não configurada
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-lg mb-2">Ações Rápidas</h3>
              <div className="space-y-2">
                <Link
                  href={`/org/${organizationSlug}/project/${projectId}/tasks/new`}
                  className="block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
                >
                  Nova Tarefa
                </Link>
                <Link
                  href={`/org/${organizationSlug}/project/${projectId}/docs`}
                  className="block w-full text-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-primary bg-white hover:bg-gray-50"
                >
                  Acessar Documentação
                </Link>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default ProjectPage; 