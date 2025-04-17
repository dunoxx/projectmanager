import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import axios from 'axios';

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
  projectId: string;
}

interface TaskListProps {
  projectId: string;
}

// Componente TaskItem otimizado com memo
const TaskItem = memo(({ 
  task, 
  onStatusChange, 
  onDelete 
}: { 
  task: Task; 
  onStatusChange: (id: string, status: 'todo' | 'in_progress' | 'done') => void; 
  onDelete: (id: string) => void; 
}) => {
  const handleStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(task.id, e.target.value as 'todo' | 'in_progress' | 'done');
  }, [task.id, onStatusChange]);

  const handleDelete = useCallback(() => {
    onDelete(task.id);
  }, [task.id, onDelete]);

  const formattedDate = useMemo(() => {
    return task.dueDate 
      ? new Date(task.dueDate).toLocaleDateString('pt-BR')
      : null;
  }, [task.dueDate]);

  const priorityClass = useMemo(() => {
    switch (task.priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, [task.priority]);

  return (
    <div className="task-item bg-white shadow-sm rounded-lg p-4 mb-3 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
        <div className="flex space-x-2">
          <select
            value={task.status}
            onChange={handleStatusChange}
            className="text-sm border rounded px-2 py-1 text-gray-600"
          >
            <option value="todo">A Fazer</option>
            <option value="in_progress">Em Progresso</option>
            <option value="done">Concluído</option>
          </select>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      <p className="text-gray-600 mb-3">{task.description}</p>
      <div className="flex flex-wrap items-center text-sm text-gray-500 gap-3">
        {task.priority && (
          <span className={`px-2 py-1 rounded-full text-xs ${priorityClass}`}>
            {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
          </span>
        )}
        {task.assignee && (
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{task.assignee.name}</span>
          </div>
        )}
        {formattedDate && (
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formattedDate}</span>
          </div>
        )}
      </div>
    </div>
  );
});

TaskItem.displayName = 'TaskItem';

// Componente TaskFilter otimizado com memo
const TaskFilter = memo(({ 
  filters, 
  onFilterChange 
}: { 
  filters: { status: string; priority: string }; 
  onFilterChange: (key: 'status' | 'priority', value: string) => void; 
}) => {
  const handleStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange('status', e.target.value);
  }, [onFilterChange]);

  const handlePriorityChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange('priority', e.target.value);
  }, [onFilterChange]);

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          value={filters.status}
          onChange={handleStatusChange}
          className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm rounded-md p-2"
        >
          <option value="">Todos</option>
          <option value="todo">A Fazer</option>
          <option value="in_progress">Em Progresso</option>
          <option value="done">Concluído</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
        <select
          value={filters.priority}
          onChange={handlePriorityChange}
          className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm rounded-md p-2"
        >
          <option value="">Todas</option>
          <option value="high">Alta</option>
          <option value="medium">Média</option>
          <option value="low">Baixa</option>
        </select>
      </div>
    </div>
  );
});

TaskFilter.displayName = 'TaskFilter';

const TaskList: React.FC<TaskListProps> = ({ projectId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'todo' as const,
    priority: 'medium' as const,
    assignee: '',
    dueDate: ''
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/tasks');
        setTasks(response.data);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar tarefas:', err);
        setError('Não foi possível carregar as tarefas. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('/api/tasks', {
        ...newTask,
        projectId
      });
      setTasks(prev => [...prev, response.data as Task]);
      setNewTask({
        title: '',
        description: '',
        status: 'todo' as const,
        priority: 'medium' as const,
        assignee: '',
        dueDate: ''
      });
    } catch (err) {
      console.error('Erro ao adicionar tarefa:', err);
      setError('Não foi possível adicionar a tarefa. Tente novamente.');
    }
  }, [newTask, projectId]);

  const handleStatusChange = useCallback(async (id: string, status: 'todo' | 'in_progress' | 'done') => {
    try {
      await axios.patch(`/api/tasks/${id}`, { status });
      setTasks(prev => 
        prev.map(task => 
          task.id === id ? { ...task, status } : task
        )
      );
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      setError('Não foi possível atualizar o status da tarefa.');
    }
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      console.error('Erro ao excluir tarefa:', err);
      setError('Não foi possível excluir a tarefa.');
    }
  }, []);

  const handleFilterChange = useCallback((key: 'status' | 'priority', value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesStatus = !filters.status || task.status === filters.status;
      const matchesPriority = !filters.priority || task.priority === filters.priority;
      return matchesStatus && matchesPriority;
    });
  }, [tasks, filters]);

  if (loading) {
    return <div className="flex justify-center mt-8"><div className="animate-spin h-8 w-8 border-4 border-indigo-500 rounded-full border-t-transparent"></div></div>;
  }

  return (
    <div className="task-list">
      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5" role="alert">{error}</div>}
      
      <div className="add-task-form bg-white shadow-sm rounded-lg p-5 mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Adicionar Nova Tarefa</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input
                type="text"
                name="title"
                value={newTask.title}
                onChange={handleInputChange}
                required
                className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
              <input
                type="text"
                name="assignee"
                value={newTask.assignee}
                onChange={handleInputChange}
                className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={newTask.status}
                onChange={handleInputChange}
                className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm rounded-md p-2"
              >
                <option value="todo">A Fazer</option>
                <option value="in_progress">Em Progresso</option>
                <option value="done">Concluído</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
              <select
                name="priority"
                value={newTask.priority}
                onChange={handleInputChange}
                className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm rounded-md p-2"
              >
                <option value="high">Alta</option>
                <option value="medium">Média</option>
                <option value="low">Baixa</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Vencimento</label>
              <input
                type="date"
                name="dueDate"
                value={newTask.dueDate}
                onChange={handleInputChange}
                className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm rounded-md p-2"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              name="description"
              value={newTask.description}
              onChange={handleInputChange}
              rows={3}
              className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm rounded-md p-2"
            ></textarea>
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Adicionar Tarefa
          </button>
        </form>
      </div>

      <div className="tasks-container">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-gray-800">Lista de Tarefas</h2>
          <span className="text-sm text-gray-500">{filteredTasks.length} tarefas</span>
        </div>
        
        <TaskFilter filters={filters} onFilterChange={handleFilterChange} />
        
        {filteredTasks.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Nenhuma tarefa encontrada com os filtros atuais.</p>
          </div>
        ) : (
          <div className="task-grid">
            {filteredTasks.map(task => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onStatusChange={handleStatusChange} 
                onDelete={handleDelete} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList; 