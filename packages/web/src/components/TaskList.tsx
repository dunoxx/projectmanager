import React, { useState } from 'react';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee?: {
    id: string;
    name: string;
    avatar: string;
  };
  dueDate?: string;
  createdAt: string;
  tags: string[];
}

interface TaskListProps {
  projectId: string;
}

const TaskList: React.FC<TaskListProps> = ({ projectId }) => {
  // Estado para as tarefas
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  
  // Estados para filtros e ordenação
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'priority' | 'dueDate' | 'createdAt'>('createdAt');
  
  // Estado para nova tarefa
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    status: 'todo' | 'in_progress' | 'done';
    priority: 'low' | 'medium' | 'high';
  }>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium'
  });

  // Filtrar tarefas
  const filteredTasks = tasks.filter((task: Task) => {
    // Filtro por status
    if (statusFilter !== 'all' && task.status !== statusFilter) {
      return false;
    }
    
    // Filtro por prioridade
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
      return false;
    }
    
    // Busca por texto
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Ordenar tarefas
  const sortedTasks = [...filteredTasks].sort((a: Task, b: Task) => {
    if (sortBy === 'priority') {
      const priorityValues: Record<string, number> = { high: 3, medium: 2, low: 1 };
      return priorityValues[b.priority] - priorityValues[a.priority];
    } else if (sortBy === 'dueDate' && a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Manipuladores de eventos
  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    
    const task: Task = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      status: newTask.status,
      priority: newTask.priority,
      createdAt: new Date().toISOString(),
      tags: []
    };
    
    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium'
    });
    setIsAddingTask(false);
  };
  
  const handleStatusChange = (taskId: string, status: 'todo' | 'in_progress' | 'done') => {
    setTasks(tasks.map((task: Task) => 
      task.id === taskId ? { ...task, status } : task
    ));
  };
  
  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task: Task) => task.id !== taskId));
  };

  // Funções auxiliares para renderização
  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'todo': return 'A Fazer';
      case 'in_progress': return 'Em Progresso';
      case 'done': return 'Concluído';
      default: return status;
    }
  };
  
  const getPriorityLabel = (priority: string) => {
    switch(priority) {
      case 'low': return 'Baixa';
      case 'medium': return 'Média';
      case 'high': return 'Alta';
      default: return priority;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="task-list">
      <div className="task-list-header">
        <h2>Tarefas do Projeto</h2>
        <button 
          className="add-task-btn"
          onClick={() => setIsAddingTask(true)}
        >
          + Nova Tarefa
        </button>
      </div>
      
      <div className="task-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar tarefas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos Status</option>
            <option value="todo">A Fazer</option>
            <option value="in_progress">Em Progresso</option>
            <option value="done">Concluído</option>
          </select>
          
          <select 
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">Todas Prioridades</option>
            <option value="high">Alta</option>
            <option value="medium">Média</option>
            <option value="low">Baixa</option>
          </select>
          
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="createdAt">Data de Criação</option>
            <option value="dueDate">Data de Vencimento</option>
            <option value="priority">Prioridade</option>
          </select>
        </div>
      </div>
      
      {isAddingTask && (
        <div className="add-task-form">
          <h3>Nova Tarefa</h3>
          <input
            type="text"
            placeholder="Título da tarefa"
            value={newTask.title}
            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
          />
          <textarea
            placeholder="Descrição (opcional)"
            value={newTask.description}
            onChange={(e) => setNewTask({...newTask, description: e.target.value})}
          />
          
          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select
                value={newTask.status}
                onChange={(e) => setNewTask({...newTask, status: e.target.value as any})}
              >
                <option value="todo">A Fazer</option>
                <option value="in_progress">Em Progresso</option>
                <option value="done">Concluído</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Prioridade</label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({...newTask, priority: e.target.value as any})}
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            </div>
          </div>
          
          <div className="form-actions">
            <button className="cancel-btn" onClick={() => setIsAddingTask(false)}>Cancelar</button>
            <button className="save-btn" onClick={handleAddTask}>Salvar</button>
          </div>
        </div>
      )}
      
      <div className="tasks-container">
        {sortedTasks.length > 0 ? (
          sortedTasks.map(task => (
            <div key={task.id} className={`task-card priority-${task.priority}`}>
              <div className="task-header">
                <div className="task-title">{task.title}</div>
                <div className="task-actions">
                  <button onClick={() => handleDeleteTask(task.id)} className="delete-btn">
                    🗑️
                  </button>
                </div>
              </div>
              
              {task.description && (
                <div className="task-description">{task.description}</div>
              )}
              
              <div className="task-meta">
                <div className="task-status">
                  <span className="meta-label">Status:</span>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value as any)}
                    className={`status-badge status-${task.status}`}
                  >
                    <option value="todo">A Fazer</option>
                    <option value="in_progress">Em Progresso</option>
                    <option value="done">Concluído</option>
                  </select>
                </div>
                
                <div className="task-priority">
                  <span className="meta-label">Prioridade:</span>
                  <span className={`priority-badge priority-${task.priority}`}>
                    {getPriorityLabel(task.priority)}
                  </span>
                </div>
              </div>
              
              <div className="task-footer">
                {task.assignee && (
                  <div className="task-assignee">
                    <span className="assignee-avatar">{task.assignee.avatar}</span>
                    <span className="assignee-name">{task.assignee.name}</span>
                  </div>
                )}
                
                <div className="task-dates">
                  {task.dueDate && (
                    <span className="due-date">
                      Vence: {formatDate(task.dueDate)}
                    </span>
                  )}
                  <span className="created-date">
                    Criada: {formatDate(task.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-tasks">
            <p>Nenhuma tarefa encontrada com os filtros atuais.</p>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .task-list {
          padding: 16px;
          width: 100%;
        }
        
        .task-list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .add-task-btn {
          background-color: #4f46e5;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }
        
        .task-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 24px;
          align-items: center;
        }
        
        .search-box {
          flex: 1;
          min-width: 200px;
        }
        
        .search-box input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
        }
        
        .filter-group {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        
        .filter-group select {
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          background-color: white;
        }
        
        .tasks-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }
        
        .task-card {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          padding: 16px;
          display: flex;
          flex-direction: column;
          border-top: 3px solid #e2e8f0;
        }
        
        .task-card.priority-high {
          border-top-color: #ef4444;
        }
        
        .task-card.priority-medium {
          border-top-color: #f59e0b;
        }
        
        .task-card.priority-low {
          border-top-color: #10b981;
        }
        
        .task-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        
        .task-title {
          font-weight: 600;
          font-size: 16px;
        }
        
        .delete-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          opacity: 0.7;
          transition: opacity 0.2s;
        }
        
        .delete-btn:hover {
          opacity: 1;
        }
        
        .task-description {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 12px;
        }
        
        .task-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 12px;
        }
        
        .meta-label {
          font-size: 12px;
          color: #64748b;
          margin-right: 4px;
        }
        
        .status-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          border: none;
          cursor: pointer;
        }
        
        .status-todo {
          background-color: #f1f5f9;
          color: #475569;
        }
        
        .status-in_progress {
          background-color: #dbeafe;
          color: #1d4ed8;
        }
        
        .status-done {
          background-color: #dcfce7;
          color: #15803d;
        }
        
        .priority-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .priority-high {
          background-color: #fee2e2;
          color: #b91c1c;
        }
        
        .priority-medium {
          background-color: #fef3c7;
          color: #b45309;
        }
        
        .priority-low {
          background-color: #d1fae5;
          color: #047857;
        }
        
        .task-footer {
          display: flex;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid #f1f5f9;
          font-size: 12px;
        }
        
        .task-assignee {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .assignee-avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: #f1f5f9;
        }
        
        .task-dates {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          color: #64748b;
        }
        
        .due-date {
          font-weight: 500;
        }
        
        .no-tasks {
          grid-column: 1 / -1;
          text-align: center;
          padding: 40px;
          color: #64748b;
          background-color: #f8fafc;
          border-radius: 8px;
        }
        
        .add-task-form {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 20px;
          margin-bottom: 24px;
        }
        
        .add-task-form h3 {
          margin-top: 0;
          margin-bottom: 16px;
          font-size: 18px;
          color: #1e293b;
        }
        
        .add-task-form input,
        .add-task-form textarea,
        .add-task-form select {
          width: 100%;
          padding: 8px 12px;
          margin-bottom: 12px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .add-task-form textarea {
          min-height: 80px;
          resize: vertical;
        }
        
        .form-row {
          display: flex;
          gap: 12px;
        }
        
        .form-group {
          flex: 1;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 4px;
          font-size: 14px;
          color: #64748b;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          margin-top: 16px;
        }
        
        .cancel-btn,
        .save-btn {
          padding: 8px 16px;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
        }
        
        .cancel-btn {
          background-color: #f1f5f9;
          color: #475569;
          border: none;
        }
        
        .save-btn {
          background-color: #4f46e5;
          color: white;
          border: none;
        }
        
        @media (max-width: 768px) {
          .form-row {
            flex-direction: column;
            gap: 4px;
          }
          
          .task-filters {
            flex-direction: column;
            align-items: stretch;
          }
          
          .filter-group {
            width: 100%;
          }
          
          .filter-group select {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
};

// Dados mockados para demonstração
const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Criar wireframes iniciais',
    description: 'Desenvolver wireframes para as principais telas do site',
    status: 'done',
    priority: 'high',
    assignee: {
      id: 'user-1',
      name: 'Maria Souza',
      avatar: '👩'
    },
    dueDate: '2024-04-10T00:00:00Z',
    createdAt: '2024-04-01T10:30:00Z',
    tags: ['design']
  },
  {
    id: 'task-2',
    title: 'Implementar header responsivo',
    status: 'done',
    priority: 'medium',
    assignee: {
      id: 'user-3',
      name: 'Pedro Santos',
      avatar: '👨'
    },
    dueDate: '2024-04-12T00:00:00Z',
    createdAt: '2024-04-02T09:15:00Z',
    tags: ['frontend', 'responsive']
  },
  {
    id: 'task-3',
    title: 'Desenvolver API de autenticação',
    description: 'Implementar endpoints para login, registro e recuperação de senha',
    status: 'in_progress',
    priority: 'high',
    assignee: {
      id: 'user-5',
      name: 'Carlos Mendes',
      avatar: '👨'
    },
    dueDate: '2024-04-20T00:00:00Z',
    createdAt: '2024-04-05T14:20:00Z',
    tags: ['backend', 'auth']
  },
  {
    id: 'task-4',
    title: 'Otimizar imagens para melhor performance',
    status: 'todo',
    priority: 'low',
    assignee: {
      id: 'user-4',
      name: 'Ana Oliveira',
      avatar: '👩'
    },
    createdAt: '2024-04-08T11:45:00Z',
    tags: ['optimization']
  },
  {
    id: 'task-5',
    title: 'Escrever documentação de API',
    description: 'Criar documentação detalhada para todos os endpoints da API',
    status: 'todo',
    priority: 'medium',
    assignee: {
      id: 'user-3',
      name: 'Pedro Santos',
      avatar: '👨'
    },
    dueDate: '2024-04-25T00:00:00Z',
    createdAt: '2024-04-10T08:30:00Z',
    tags: ['documentation', 'api']
  }
];

export default TaskList; 