import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import PageLayout from '../../../../../components/layouts/PageLayout';
import { Spinner, Alert, Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../../components/ui';
import DocumentationTest from '../../../../../components/DocumentationTest';

interface Project {
  id: string;
  name: string;
  slug: string;
  description?: string;
  hasDocumentation?: boolean;
}

/**
 * Página de configurações do projeto
 * Permite configurar diversos aspectos do projeto, incluindo a documentação
 */
const ProjectSettingsPage: React.FC = () => {
  const router = useRouter();
  const { organizationSlug, projectId } = router.query;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('general');

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
      } catch (error: any) {
        console.error('Erro ao carregar projeto:', error);
        setError('Não foi possível carregar os dados do projeto. Tente novamente mais tarde.');
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

  if (error || !project) {
    return (
      <PageLayout title="Erro">
        <Alert
          variant="destructive"
          title="Erro ao carregar projeto"
          description={error || 'Projeto não encontrado ou sem permissão de acesso.'}
        />
      </PageLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Configurações | {project.name} | Project Manager</title>
      </Head>
      <PageLayout 
        title={`Configurações - ${project.name}`}
        breadcrumbs={[
          { label: 'Organizações', href: '/organizations' },
          { label: organizationSlug as string, href: `/org/${organizationSlug}` },
          { label: 'Projetos', href: `/org/${organizationSlug}/projects` },
          { label: project.name, href: `/org/${organizationSlug}/project/${projectId}` },
          { label: 'Configurações', href: `/org/${organizationSlug}/project/${projectId}/settings` },
        ]}
      >
        {/* Navegação por abas */}
        <div className="mb-8 border-b">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <a
                key={tab.id}
                href={tab.href}
                className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                  tab.id === 'settings'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Tabs de configurações */}
        <Tabs defaultValue="general" className="w-full" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="documentation">Documentação</TabsTrigger>
            <TabsTrigger value="members">Membros</TabsTrigger>
            <TabsTrigger value="advanced">Avançado</TabsTrigger>
          </TabsList>
          
          {/* Aba Geral */}
          <TabsContent value="general" className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-4">Informações Básicas</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Projeto
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={project.name}
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Identificador (Slug)
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={project.slug}
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                    value={project.description || ''}
                    disabled
                  />
                </div>
                <p className="text-sm text-gray-500 italic">
                  A edição de informações básicas está desabilitada nesta versão de demonstração.
                </p>
              </form>
            </div>
          </TabsContent>
          
          {/* Aba Documentação */}
          <TabsContent value="documentation" className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-4">Status da Documentação</h3>
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className={`w-3 h-3 rounded-full mr-2 ${project.hasDocumentation ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="text-sm font-medium">
                    {project.hasDocumentation ? 'Documentação Ativa' : 'Documentação Não Configurada'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {project.hasDocumentation
                    ? 'Este projeto possui uma documentação integrada com o Outline. Você pode acessá-la pela aba "Documentação".'
                    : 'Este projeto ainda não possui documentação integrada. Use o teste abaixo para criar uma documentação.'}
                </p>
              </div>
            </div>
            
            {/* Componente de teste de documentação */}
            {projectId && organizationSlug && (
              <DocumentationTest
                projectId={projectId as string}
                organizationSlug={organizationSlug as string}
              />
            )}
          </TabsContent>
          
          {/* Aba Membros */}
          <TabsContent value="members" className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-4">Membros do Projeto</h3>
              <p className="text-sm text-gray-500 mb-4">
                Gerencie os membros e suas permissões neste projeto.
              </p>
              <div className="text-center py-8">
                <p className="text-gray-500">Funcionalidade não disponível nesta versão demonstrativa.</p>
              </div>
            </div>
          </TabsContent>
          
          {/* Aba Avançado */}
          <TabsContent value="advanced" className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-4">Configurações Avançadas</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-medium text-red-600 mb-2">Zona de Perigo</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    As ações abaixo são irreversíveis e podem causar perda de dados.
                    Prossiga com cautela.
                  </p>
                  
                  <div className="space-y-4 border-t pt-4">
                    <div>
                      <h5 className="text-sm font-medium mb-1">Remover Documentação</h5>
                      <p className="text-xs text-gray-500 mb-2">
                        Desvincula a documentação deste projeto, mas mantém os documentos no Outline.
                      </p>
                      <button
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
                        disabled
                      >
                        Desvincular Documentação
                      </button>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium mb-1">Excluir Projeto</h5>
                      <p className="text-xs text-gray-500 mb-2">
                        Exclui permanentemente este projeto e todos os seus dados, incluindo tarefas e documentos.
                      </p>
                      <button
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                        disabled
                      >
                        Excluir Projeto
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </PageLayout>
    </>
  );
};

export default ProjectSettingsPage; 