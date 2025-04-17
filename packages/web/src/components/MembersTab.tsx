import React, { useState } from 'react';

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  joinedAt: string;
  status: 'active' | 'invited' | 'inactive';
}

interface MembersTabProps {
  projectId: string;
}

const MembersTab: React.FC<MembersTabProps> = ({ projectId }) => {
  // Estado para membros do projeto
  const [members, setMembers] = useState<Member[]>(mockMembers);
  
  // Estado para modal de convite
  const [isInviting, setIsInviting] = useState(false);
  const [invite, setInvite] = useState({ email: '', role: 'member' });
  
  // Estado para pesquisa
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filtrar membros com base na pesquisa
  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Funções para gerenciar membros
  const handleInviteMember = () => {
    if (!invite.email.trim()) return;
    
    const newMember: Member = {
      id: `member-${Date.now()}`,
      name: invite.email.split('@')[0], // Nome temporário baseado no email
      email: invite.email,
      role: invite.role,
      avatar: '👤',
      joinedAt: new Date().toISOString(),
      status: 'invited'
    };
    
    setMembers([...members, newMember]);
    setInvite({ email: '', role: 'member' });
    setIsInviting(false);
  };
  
  const handleRemoveMember = (memberId: string) => {
    setMembers(members.filter(member => member.id !== memberId));
  };
  
  const handleChangeRole = (memberId: string, newRole: string) => {
    setMembers(members.map(member => 
      member.id === memberId ? { ...member, role: newRole } : member
    ));
  };
  
  // Formatação de data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="members-tab">
      <div className="header">
        <h2>Membros do Projeto</h2>
        <button 
          className="invite-btn"
          onClick={() => setIsInviting(true)}
        >
          + Convidar Membro
        </button>
      </div>
      
      <div className="search-box">
        <input
          type="text"
          placeholder="Buscar por nome, email ou função..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {isInviting && (
        <div className="invite-form">
          <h3>Convidar Novo Membro</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="email@exemplo.com"
                value={invite.email}
                onChange={(e) => setInvite({...invite, email: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Função</label>
              <select
                value={invite.role}
                onChange={(e) => setInvite({...invite, role: e.target.value})}
              >
                <option value="admin">Administrador</option>
                <option value="member">Membro</option>
                <option value="viewer">Visualizador</option>
              </select>
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              className="cancel-btn" 
              onClick={() => setIsInviting(false)}
            >
              Cancelar
            </button>
            <button 
              className="invite-action-btn" 
              onClick={handleInviteMember}
              disabled={!invite.email.trim()}
            >
              Enviar Convite
            </button>
          </div>
        </div>
      )}
      
      <div className="members-table">
        <div className="table-header">
          <div className="member-info-cell">Membro</div>
          <div className="member-role-cell">Função</div>
          <div className="member-date-cell">Adicionado em</div>
          <div className="member-status-cell">Status</div>
          <div className="member-actions-cell">Ações</div>
        </div>
        
        <div className="table-body">
          {filteredMembers.length > 0 ? (
            filteredMembers.map(member => (
              <div key={member.id} className="table-row">
                <div className="member-info-cell">
                  <div className="member-avatar">{member.avatar}</div>
                  <div className="member-details">
                    <div className="member-name">{member.name}</div>
                    <div className="member-email">{member.email}</div>
                  </div>
                </div>
                
                <div className="member-role-cell">
                  <select
                    value={member.role}
                    onChange={(e) => handleChangeRole(member.id, e.target.value)}
                    className="role-select"
                  >
                    <option value="admin">Administrador</option>
                    <option value="member">Membro</option>
                    <option value="viewer">Visualizador</option>
                  </select>
                </div>
                
                <div className="member-date-cell">
                  {formatDate(member.joinedAt)}
                </div>
                
                <div className="member-status-cell">
                  <span className={`status-badge status-${member.status}`}>
                    {member.status === 'active' && 'Ativo'}
                    {member.status === 'invited' && 'Convidado'}
                    {member.status === 'inactive' && 'Inativo'}
                  </span>
                </div>
                
                <div className="member-actions-cell">
                  <button 
                    onClick={() => handleRemoveMember(member.id)}
                    className="remove-btn"
                    title="Remover membro"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-message">
              Nenhum membro encontrado com os critérios de busca.
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .members-tab {
          padding: 16px;
          width: 100%;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        h2 {
          font-size: 20px;
          color: #1e293b;
          margin: 0;
        }
        
        .invite-btn {
          background-color: #4f46e5;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }
        
        .search-box {
          margin-bottom: 24px;
        }
        
        .search-box input {
          width: 100%;
          padding: 10px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 14px;
        }
        
        .invite-form {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 20px;
          margin-bottom: 24px;
        }
        
        .invite-form h3 {
          font-size: 18px;
          margin-top: 0;
          margin-bottom: 16px;
          color: #1e293b;
        }
        
        .form-row {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
        }
        
        .form-group {
          flex: 1;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-size: 14px;
          color: #64748b;
        }
        
        .form-group input,
        .form-group select {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
        
        .cancel-btn {
          background-color: #f1f5f9;
          color: #475569;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }
        
        .invite-action-btn {
          background-color: #4f46e5;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }
        
        .invite-action-btn:disabled {
          background-color: #cbd5e1;
          cursor: not-allowed;
        }
        
        .members-table {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }
        
        .table-header {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          background-color: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          font-weight: 600;
          color: #475569;
          font-size: 14px;
        }
        
        .table-row {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .table-row:last-child {
          border-bottom: none;
        }
        
        .member-info-cell {
          flex: 3;
          display: flex;
          align-items: center;
          min-width: 250px;
        }
        
        .member-role-cell {
          flex: 1;
          min-width: 120px;
        }
        
        .member-date-cell {
          flex: 1;
          min-width: 110px;
          color: #64748b;
          font-size: 14px;
        }
        
        .member-status-cell {
          flex: 1;
          min-width: 100px;
        }
        
        .member-actions-cell {
          flex: 0.5;
          min-width: 50px;
          text-align: right;
        }
        
        .member-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          font-size: 20px;
        }
        
        .member-details {
          display: flex;
          flex-direction: column;
        }
        
        .member-name {
          font-weight: 500;
          color: #1e293b;
        }
        
        .member-email {
          font-size: 13px;
          color: #64748b;
        }
        
        .role-select {
          padding: 6px 8px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 13px;
          width: 100%;
        }
        
        .status-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .status-active {
          background-color: #dcfce7;
          color: #15803d;
        }
        
        .status-invited {
          background-color: #fff7ed;
          color: #c2410c;
        }
        
        .status-inactive {
          background-color: #f3f4f6;
          color: #6b7280;
        }
        
        .remove-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          opacity: 0.6;
          transition: opacity 0.2s;
        }
        
        .remove-btn:hover {
          opacity: 1;
        }
        
        .empty-message {
          padding: 40px 16px;
          text-align: center;
          color: #64748b;
          font-style: italic;
        }
        
        @media (max-width: 768px) {
          .form-row {
            flex-direction: column;
            gap: 12px;
          }
          
          .table-header {
            display: none;
          }
          
          .table-row {
            flex-direction: column;
            padding: 16px;
            gap: 12px;
            position: relative;
          }
          
          .member-info-cell {
            width: 100%;
          }
          
          .member-role-cell,
          .member-date-cell,
          .member-status-cell {
            width: 100%;
            padding-left: 52px;
          }
          
          .member-role-cell::before {
            content: 'Função: ';
            color: #64748b;
            font-weight: 500;
          }
          
          .member-date-cell::before {
            content: 'Desde: ';
            color: #64748b;
            font-weight: 500;
          }
          
          .member-status-cell::before {
            content: 'Status: ';
            color: #64748b;
            font-weight: 500;
          }
          
          .member-actions-cell {
            position: absolute;
            top: 16px;
            right: 16px;
          }
        }
      `}</style>
    </div>
  );
};

// Dados mockados para demonstração
const mockMembers: Member[] = [
  {
    id: 'user-1',
    name: 'João Silva',
    email: 'joao.silva@exemplo.com',
    role: 'admin',
    avatar: '👨',
    joinedAt: '2024-03-15T10:00:00Z',
    status: 'active'
  },
  {
    id: 'user-2',
    name: 'Maria Souza',
    email: 'maria.souza@exemplo.com',
    role: 'member',
    avatar: '👩',
    joinedAt: '2024-03-18T14:30:00Z',
    status: 'active'
  },
  {
    id: 'user-3',
    name: 'Pedro Santos',
    email: 'pedro.santos@exemplo.com',
    role: 'member',
    avatar: '👨',
    joinedAt: '2024-03-20T09:15:00Z',
    status: 'active'
  },
  {
    id: 'user-4',
    name: 'Ana Oliveira',
    email: 'ana.oliveira@exemplo.com',
    role: 'viewer',
    avatar: '👩',
    joinedAt: '2024-03-22T16:45:00Z',
    status: 'active'
  },
  {
    id: 'user-5',
    name: 'Carlos Mendes',
    email: 'carlos.mendes@exemplo.com',
    role: 'member',
    avatar: '👨',
    joinedAt: '2024-03-25T11:30:00Z',
    status: 'active'
  },
  {
    id: 'user-6',
    name: 'Amanda Pereira',
    email: 'amanda.pereira@exemplo.com',
    role: 'member',
    avatar: '👩',
    joinedAt: '2024-04-01T08:20:00Z',
    status: 'invited'
  }
];

export default MembersTab; 