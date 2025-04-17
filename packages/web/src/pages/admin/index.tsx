import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import PageLayout from '../../components/layouts/PageLayout';

/**
 * Página principal do painel administrativo
 * Esta página lista todas as funcionalidades administrativas disponíveis
 */
const AdminDashboardPage: React.FC = () => {
  // Array com os recursos administrativos disponíveis
  const adminResources = [
    {
      id: 'documentation-stats',
      title: 'Estatísticas de Documentação',
      description: 'Visualize métricas e informações sobre as integrações entre projetos e suas documentações.',
      href: '/admin/documentation-stats',
      icon: '📊',
      color: 'bg-blue-50 text-blue-800',
    },
    {
      id: 'organizations',
      title: 'Gerenciar Organizações',
      description: 'Visualize e gerencie todas as organizações na plataforma.',
      href: '/admin/organizations',
      icon: '🏢',
      color: 'bg-green-50 text-green-800',
    },
    {
      id: 'users',
      title: 'Gerenciar Usuários',
      description: 'Visualize e gerencie todos os usuários cadastrados na plataforma.',
      href: '/admin/users',
      icon: '👥',
      color: 'bg-purple-50 text-purple-800',
    },
    {
      id: 'integrations',
      title: 'Gerenciar Integrações',
      description: 'Configure e gerencie integrações com serviços externos.',
      href: '/admin/integrations',
      icon: '🔄',
      color: 'bg-orange-50 text-orange-800',
    },
    {
      id: 'settings',
      title: 'Configurações da Plataforma',
      description: 'Ajuste as configurações globais da plataforma.',
      href: '/admin/settings',
      icon: '⚙️',
      color: 'bg-gray-50 text-gray-800',
    },
  ];

  return (
    <>
      <Head>
        <title>Painel Administrativo | Project Manager</title>
      </Head>
      <PageLayout 
        title="Painel Administrativo" 
        description="Gerenciamento e configuração da plataforma"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
        ]}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {adminResources.map((resource) => (
            <Link key={resource.id} href={resource.href}>
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition duration-200 h-full flex flex-col">
                <div className={`${resource.color} w-12 h-12 rounded-lg flex items-center justify-center text-xl mb-4`}>
                  {resource.icon}
                </div>
                <h3 className="text-lg font-medium mb-2">{resource.title}</h3>
                <p className="text-gray-600 text-sm flex-grow">{resource.description}</p>
                <div className="mt-4 text-sm text-primary font-medium">
                  Acessar →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </PageLayout>
    </>
  );
};

export default AdminDashboardPage; 