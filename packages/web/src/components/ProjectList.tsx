import React, { useState } from 'react';
import Link from 'next/link';

// Interface para a estrutura de um projeto
interface Project {
  id: string;
  name: string;
  description: string;
  icon?: string;
  status: 'active' | 'completed' | 'archived';
  progress: number;
  members: number;
  tasks: {
    total: number;
    completed: number;
  };
  updatedAt: string;
}

// Props para o componente ProjectList
interface ProjectListProps {
  organizationSlug?: string;
}

const ProjectList: React.FC<ProjectListProps> = ({ organizationSlug = 'default' }) => {
  // Projetos mockados para demonstração
  const demoProjects: Project[] = [
    {
      id: 'proj-1',
      name: 'Projeto Website',
      description: 'Desenvolvimento do novo website corporativo',
      icon: '🌐',
      status: 'active',
      progress: 75,
      members: 5,
      tasks: { total: 32, completed: 24 },
      updatedAt: '2024-04-15T14:30:00Z',
    },
    {
      id: 'proj-2',
      name: 'Aplicativo Mobile',
      description: 'Aplicativo para iOS e Android',
      icon: '📱',
      status: 'active',
      progress: 45,
      members: 8,
      tasks: { total: 56, completed: 25 },
      updatedAt: '2024-04-16T10:15:00Z',
    },
    {
      id: 'proj-3',
      name: 'Infraestrutura',
      description: 'Migração para a nuvem',
      icon: '🖥️',
      status: 'active',
      progress: 30,
      members: 3,
      tasks: { total: 18, completed: 5 },
      updatedAt: '2024-04-17T09:45:00Z',
    },
    {
      id: 'proj-4',
      name: 'Marketing Digital',
      description: 'Campanha para Q2 2024',
      icon: '📊',
      status: 'completed',
      progress: 100,
      members: 4,
      tasks: { total: 24, completed: 24 },
      updatedAt: '2024-04-10T16:20:00Z',
    },
    {
      id: 'proj-5',
      name: 'Redesign UI/UX',
      description: 'Atualização do design system',
      icon: '🎨',
      status: 'archived',
      progress: 100,
      members: 2,
      tasks: { total: 15, completed: 15 },
      updatedAt: '2024-03-20T11:30:00Z',
    },
  ];

  // Estado para filtros
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'archived'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar projetos com base no estado atual
  const filteredProjects = demoProjects
    .filter(project => {
      if (filter === 'all') return true;
      return project.status === filter;
    })
    .filter(project => 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Formatar data para exibição
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="project-list-container">
      <div className="header">
        <h1>Projetos</h1>
        <button className="new-btn">+ Novo Projeto</button>
      </div>

      <div className="filters">
        <div className="search">
          <input 
            type="text" 
            placeholder="Buscar projetos..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          <button 
            className={`tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Todos
          </button>
          <button 
            className={`tab ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Ativos
          </button>
          <button 
            className={`tab ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Concluídos
          </button>
          <button 
            className={`tab ${filter === 'archived' ? 'active' : ''}`}
            onClick={() => setFilter('archived')}
          >
            Arquivados
          </button>
        </div>
      </div>

      <div className="projects-grid">
        {filteredProjects.length > 0 ? (
          filteredProjects.map(project => (
            <Link 
              href={`/org/${organizationSlug}/project/${project.id}`} 
              key={project.id}
              className="project-card"
            >
              <div className="project-header">
                <span className="project-icon">{project.icon}</span>
                <div className="status-badge" data-status={project.status}>
                  {project.status === 'active' && 'Ativo'}
                  {project.status === 'completed' && 'Concluído'}
                  {project.status === 'archived' && 'Arquivado'}
                </div>
              </div>
              <h3 className="project-title">{project.name}</h3>
              <p className="project-description">{project.description}</p>
              <div className="project-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <span className="progress-text">{project.progress}%</span>
              </div>
              <div className="project-meta">
                <div className="meta-item">
                  <span className="meta-icon">👥</span>
                  <span>{project.members}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">✓</span>
                  <span>{`${project.tasks.completed}/${project.tasks.total}`}</span>
                </div>
                <div className="meta-date">
                  <span>Atualizado: {formatDate(project.updatedAt)}</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="no-results">
            <p>Nenhum projeto encontrado com os filtros atuais.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .project-list-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        h1 {
          font-size: 28px;
          color: #1e293b;
          margin: 0;
        }

        .new-btn {
          background-color: #4f46e5;
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .new-btn:hover {
          background-color: #4338ca;
        }

        .filters {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .search input {
          width: 100%;
          padding: 10px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 16px;
        }

        .filter-tabs {
          display: flex;
          gap: 8px;
        }

        .tab {
          padding: 8px 16px;
          background: none;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          color: #64748b;
          transition: all 0.2s;
        }

        .tab:hover {
          border-color: #cbd5e1;
          color: #1e293b;
        }

        .tab.active {
          background-color: #f1f5f9;
          border-color: #cbd5e1;
          color: #1e293b;
          font-weight: 500;
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .project-card {
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          padding: 20px;
          transition: transform 0.2s, box-shadow 0.2s;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          border: 1px solid #e2e8f0;
        }

        .project-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.05);
        }

        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .project-icon {
          font-size: 24px;
          background-color: #f1f5f9;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
        }

        .status-badge {
          font-size: 12px;
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: 500;
        }

        .status-badge[data-status="active"] {
          background-color: #dcfce7;
          color: #15803d;
        }

        .status-badge[data-status="completed"] {
          background-color: #dbeafe;
          color: #1d4ed8;
        }

        .status-badge[data-status="archived"] {
          background-color: #f3f4f6;
          color: #6b7280;
        }

        .project-title {
          font-size: 18px;
          margin: 0 0 8px;
          color: #1e293b;
        }

        .project-description {
          font-size: 14px;
          color: #64748b;
          margin: 0 0 16px;
          flex-grow: 1;
        }

        .project-progress {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .progress-bar {
          flex: 1;
          height: 8px;
          background-color: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background-color: #4f46e5;
          border-radius: 4px;
        }

        .progress-text {
          font-size: 14px;
          font-weight: 500;
          color: #4f46e5;
        }

        .project-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          color: #64748b;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .meta-icon {
          font-size: 14px;
        }

        .meta-date {
          font-size: 12px;
        }

        .no-results {
          grid-column: 1 / -1;
          text-align: center;
          padding: 40px;
          background-color: #f8fafc;
          border-radius: 10px;
          color: #64748b;
        }

        @media (max-width: 768px) {
          .projects-grid {
            grid-template-columns: 1fr;
          }
          
          .header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          
          .filter-tabs {
            overflow-x: auto;
            padding-bottom: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectList; 