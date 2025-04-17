import React, { useState } from 'react';
import Link from 'next/link';

interface SidebarProps {
  organizationSlug?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ organizationSlug = 'default' }) => {
  const [expanded, setExpanded] = useState(true);
  
  // Projetos mockados para demonstração
  const projects = [
    { id: 'proj-1', name: 'Projeto Website', icon: '🌐' },
    { id: 'proj-2', name: 'Aplicativo Mobile', icon: '📱' },
    { id: 'proj-3', name: 'Infraestrutura', icon: '🖥️' },
    { id: 'proj-4', name: 'Marketing Digital', icon: '📊' },
  ];

  return (
    <div className={`sidebar ${expanded ? 'expanded' : 'collapsed'}`}>
      <div className="sidebar-header">
        <h1 className="logo">PM</h1>
        <button 
          className="toggle-btn" 
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? '◀' : '▶'}
        </button>
      </div>

      <div className="sidebar-content">
        <nav className="main-nav">
          <ul>
            <li>
              <Link href="/dashboard" className="nav-link">
                <span className="icon">📊</span>
                {expanded && <span className="text">Dashboard</span>}
              </Link>
            </li>
            <li>
              <Link href="/projects" className="nav-link">
                <span className="icon">📁</span>
                {expanded && <span className="text">Projetos</span>}
              </Link>
            </li>
            <li>
              <Link href="/tasks" className="nav-link">
                <span className="icon">✅</span>
                {expanded && <span className="text">Tarefas</span>}
              </Link>
            </li>
            <li>
              <Link href="/docs" className="nav-link">
                <span className="icon">📄</span>
                {expanded && <span className="text">Documentação</span>}
              </Link>
            </li>
          </ul>
        </nav>

        {expanded && (
          <div className="projects-section">
            <h2 className="section-title">Projetos Recentes</h2>
            <ul>
              {projects.map(project => (
                <li key={project.id}>
                  <Link href={`/org/${organizationSlug}/project/${project.id}`} className="project-link">
                    <span className="icon">{project.icon}</span>
                    <span className="text">{project.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="sidebar-footer">
        <Link href="/settings" className="nav-link">
          <span className="icon">⚙️</span>
          {expanded && <span className="text">Configurações</span>}
        </Link>
        <Link href="/profile" className="nav-link">
          <span className="icon">👤</span>
          {expanded && <span className="text">Perfil</span>}
        </Link>
      </div>

      <style jsx>{`
        .sidebar {
          display: flex;
          flex-direction: column;
          background-color: #1e293b;
          color: white;
          height: 100vh;
          transition: width 0.3s ease;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 100;
        }

        .expanded {
          width: 240px;
        }

        .collapsed {
          width: 64px;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          border-bottom: 1px solid #2d3748;
        }

        .logo {
          font-size: 24px;
          margin: 0;
          font-weight: bold;
          color: #4f46e5;
        }

        .toggle-btn {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          font-size: 12px;
        }

        .sidebar-content {
          flex: 1;
          overflow-y: auto;
          padding: 16px 0;
        }

        .sidebar-footer {
          border-top: 1px solid #2d3748;
          padding: 16px;
          display: flex;
          justify-content: space-around;
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .nav-link, .project-link {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          color: #cbd5e1;
          text-decoration: none;
          transition: background-color 0.2s;
          border-radius: 4px;
          margin: 2px 8px;
        }

        .nav-link:hover, .project-link:hover {
          background-color: #2d3748;
          color: white;
        }

        .icon {
          margin-right: ${expanded ? '12px' : '0'};
          font-size: 18px;
          min-width: 24px;
          text-align: center;
        }

        .section-title {
          font-size: 14px;
          text-transform: uppercase;
          color: #94a3b8;
          margin: 24px 16px 8px;
          font-weight: 500;
        }

        .projects-section {
          margin-top: 20px;
        }

        .project-link {
          padding: 8px 16px;
        }
      `}</style>
    </div>
  );
};

export default Sidebar; 