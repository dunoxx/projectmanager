import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ProjectDetail from '../../../../../components/ProjectDetail';
import Sidebar from '../../../../../components/Sidebar';

const ProjectPage: React.FC = () => {
  const router = useRouter();
  const { organizationSlug, projectId } = router.query;

  return (
    <div className="project-page">
      <Head>
        <title>Projeto | Project Manager</title>
        <meta name="description" content="Gerenciamento de projeto e documentação" />
      </Head>

      <Sidebar organizationSlug={organizationSlug as string} />

      <main className="main-content">
        {projectId && organizationSlug && (
          <ProjectDetail 
            projectId={projectId as string} 
            organizationSlug={organizationSlug as string} 
          />
        )}
      </main>

      <style jsx>{`
        .project-page {
          display: flex;
          min-height: 100vh;
        }

        .main-content {
          flex: 1;
          margin-left: 240px;
          transition: margin-left 0.3s ease;
        }

        @media (max-width: 768px) {
          .main-content {
            margin-left: 64px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectPage; 