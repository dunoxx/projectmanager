import React, { useState } from 'react';
import DocumentationTab from './DocumentationTab';

interface ProjectDetailProps {
  projectId: string;
  organizationSlug: string;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ 
  projectId, 
  organizationSlug 
}) => {
  // Estado para controlar qual aba está ativa
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'members' | 'docs'>('overview');
  
  // Dados mockados do projeto
  const project = {
    id: projectId,
    name: 'Projeto Website',
    description: 'Desenvolvimento do novo website corporativo com foco em experiência do usuário e velocidade.',
    icon: '🌐',
    status: 'active',
    progress: 75,
    startDate: '2024-03-01',
    dueDate: '2024-06-30',
    members: [
      { id: 'user1', name: 'João Silva', role: 'Líder', avatar: '👨' },
      { id: 'user2', name: 'Maria Souza', role: 'Designer', avatar: '👩' },
      { id: 'user3', name: 'Pedro Santos', role: 'Desenvolvedor', avatar: '👨' },
      { id: 'user4', name: 'Ana Oliveira', role: 'QA', avatar: '👩' },
      { id: 'user5', name: 'Carlos Mendes', role: 'Desenvolvedor', avatar: '👨' }
    ],
    tasks: {
      total: 32,
      completed: 24,
      inProgress: 5,
      pending: 3
    },
    recentActivities: [
      { id: 'act1', user: 'João Silva', action: 'completou a tarefa', item: 'Implementar header responsivo', time: '2h atrás' },
      { id: 'act2', user: 'Maria Souza', action: 'adicionou', item: '3 novos mockups', time: '4h atrás' },
      { id: 'act3', user: 'Pedro Santos', action: 'comentou em', item: 'Otimização de imagens', time: '1d atrás' }
    ]
  };

  return (
    <div className="project-detail">
      <div className="project-header">
        <div className="project-title">
          <span className="project-icon">{project.icon}</span>
          <h1>{project.name}</h1>
        </div>

        <div className="project-actions">
          <button className="action-btn secondary">Compartilhar</button>
          <button className="action-btn primary">Editar Projeto</button>
        </div>
      </div>

      <p className="project-description">{project.description}</p>

      <div className="project-stats">
        <div className="stat-card">
          <h3>Progresso</h3>
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
            <span className="progress-text">{project.progress}%</span>
          </div>
        </div>
        
        <div className="stat-card">
          <h3>Tarefas</h3>
          <div className="tasks-stats">
            <div className="task-stat">
              <span className="stat-label">Concluídas</span>
              <span className="stat-value completed">{project.tasks.completed}</span>
            </div>
            <div className="task-stat">
              <span className="stat-label">Em Progresso</span>
              <span className="stat-value in-progress">{project.tasks.inProgress}</span>
            </div>
            <div className="task-stat">
              <span className="stat-label">Pendentes</span>
              <span className="stat-value pending">{project.tasks.pending}</span>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <h3>Datas</h3>
          <div className="dates">
            <div className="date-item">
              <span className="date-label">Início</span>
              <span className="date-value">{project.startDate}</span>
            </div>
            <div className="date-item">
              <span className="date-label">Término</span>
              <span className="date-value">{project.dueDate}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Visão Geral
        </button>
        <button 
          className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          Tarefas
        </button>
        <button 
          className={`tab-btn ${activeTab === 'members' ? 'active' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          Membros
        </button>
        <button 
          className={`tab-btn ${activeTab === 'docs' ? 'active' : ''}`}
          onClick={() => setActiveTab('docs')}
        >
          Documentação
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="recent-activities">
              <h2>Atividades Recentes</h2>
              <ul className="activity-list">
                {project.recentActivities.map(activity => (
                  <li key={activity.id} className="activity-item">
                    <div className="activity-content">
                      <strong>{activity.user}</strong> {activity.action} <span className="activity-item-name">{activity.item}</span>
                    </div>
                    <span className="activity-time">{activity.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="team-members">
              <h2>Equipe do Projeto</h2>
              <div className="members-list">
                {project.members.map(member => (
                  <div key={member.id} className="member-card">
                    <div className="member-avatar">{member.avatar}</div>
                    <div className="member-info">
                      <h3 className="member-name">{member.name}</h3>
                      <p className="member-role">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="tasks-tab">
            <p className="placeholder-message">Conteúdo da aba de Tarefas será implementado em breve.</p>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="members-tab">
            <p className="placeholder-message">Conteúdo da aba de Membros será implementado em breve.</p>
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="docs-tab">
            <DocumentationTab 
              projectId={projectId} 
              organizationSlug={organizationSlug} 
            />
          </div>
        )}
      </div>

      <style jsx>{`
        .project-detail {
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .project-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .project-icon {
          font-size: 28px;
          background-color: #f1f5f9;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
        }

        h1 {
          font-size: 24px;
          margin: 0;
          color: #1e293b;
        }

        .project-actions {
          display: flex;
          gap: 12px;
        }

        .action-btn {
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          border: none;
        }

        .action-btn.primary {
          background-color: #4f46e5;
          color: white;
        }

        .action-btn.secondary {
          background-color: #f1f5f9;
          color: #1e293b;
        }

        .project-description {
          color: #64748b;
          margin-bottom: 24px;
          font-size: 16px;
          line-height: 1.5;
        }

        .project-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .stat-card {
          background-color: white;
          padding: 16px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
        }

        .stat-card h3 {
          margin-top: 0;
          margin-bottom: 12px;
          font-size: 16px;
          color: #64748b;
          font-weight: 500;
        }

        .progress-container {
          display: flex;
          align-items: center;
          gap: 12px;
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
          font-weight: 600;
          color: #4f46e5;
        }

        .tasks-stats {
          display: flex;
          justify-content: space-between;
        }

        .task-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-label {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 18px;
          font-weight: 600;
        }

        .stat-value.completed {
          color: #10b981;
        }

        .stat-value.in-progress {
          color: #f59e0b;
        }

        .stat-value.pending {
          color: #6b7280;
        }

        .dates {
          display: flex;
          justify-content: space-around;
        }

        .date-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .date-label {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 4px;
        }

        .date-value {
          font-weight: 500;
        }

        .tabs {
          display: flex;
          border-bottom: 1px solid #e2e8f0;
          margin-bottom: 24px;
        }

        .tab-btn {
          padding: 12px 20px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          font-weight: 500;
          color: #64748b;
          cursor: pointer;
        }

        .tab-btn.active {
          color: #4f46e5;
          border-bottom-color: #4f46e5;
        }

        .tab-content {
          min-height: 400px;
        }

        .recent-activities {
          margin-bottom: 32px;
        }

        h2 {
          font-size: 18px;
          color: #1e293b;
          margin-bottom: 16px;
        }

        .activity-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .activity-item {
          display: flex;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid #e2e8f0;
        }

        .activity-item:last-child {
          border-bottom: none;
        }

        .activity-item-name {
          color: #4f46e5;
        }

        .activity-time {
          color: #94a3b8;
          font-size: 14px;
        }

        .members-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }

        .member-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 8px;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .member-avatar {
          font-size: 24px;
          background-color: #e2e8f0;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .member-info {
          overflow: hidden;
        }

        .member-name {
          font-size: 16px;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .member-role {
          font-size: 14px;
          color: #64748b;
          margin: 0;
        }

        .placeholder-message {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 200px;
          color: #94a3b8;
          font-style: italic;
        }

        .docs-tab {
          height: 600px;
        }

        @media (max-width: 768px) {
          .project-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .project-actions {
            width: 100%;
          }

          .action-btn {
            flex: 1;
          }

          .tabs {
            overflow-x: auto;
          }

          .tab-btn {
            white-space: nowrap;
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectDetail; 