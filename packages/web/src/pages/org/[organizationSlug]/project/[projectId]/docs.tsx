import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import DocumentationViewer from '../../../../../components/DocumentationViewer';
import PageLayout from '../../../../../components/layouts/PageLayout';

/**
 * Página de documentação do projeto
 * Esta página é acessada quando o usuário clica na aba "Documentação" de um projeto
 */
const ProjectDocumentationPage: React.FC = () => {
  const router = useRouter();
  const { organizationSlug, projectId } = router.query;

  if (!organizationSlug || !projectId) {
    return (
      <PageLayout title="Carregando...">
        <div className="flex items-center justify-center h-96">
          <p>Carregando...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Documentação | Projeto</title>
      </Head>
      <PageLayout 
        title="Documentação" 
        breadcrumbs={[
          { label: 'Organizações', href: '/organizations' },
          { label: organizationSlug as string, href: `/org/${organizationSlug}` },
          { label: 'Projetos', href: `/org/${organizationSlug}/projects` },
          { label: 'Documentação', href: `/org/${organizationSlug}/project/${projectId}/docs` },
        ]}
      >
        <div className="h-[calc(100vh-12rem)]">
          <DocumentationViewer 
            projectId={projectId as string}
            organizationSlug={organizationSlug as string}
          />
        </div>
      </PageLayout>
    </>
  );
};

export default ProjectDocumentationPage; 