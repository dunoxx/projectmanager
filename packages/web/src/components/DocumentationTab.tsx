import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

interface DocumentationTabProps {
  // organizationSlug e projectId vêm da URL quando o componente está renderizado
  // dentro de um projeto específico
  organizationSlug?: string;
  projectId?: string;
}

// Esta componente será renderizado na aba "Documentation" dentro de um projeto no Plane
const DocumentationTab: React.FC<DocumentationTabProps> = ({ 
  organizationSlug: orgSlugProp, 
  projectId: projectIdProp 
}) => {
  const params = useParams<{ workspaceSlug: string; projectId: string }>();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use props ou valores da URL
  const organizationSlug = orgSlugProp || params.workspaceSlug;
  const projectId = projectIdProp || params.projectId;

  // URL para o Outline, filtrando pela collection específica do projeto
  const outlineUrl = `/org/${organizationSlug}/project/${projectId}/docs`;

  // Função para lidar com mensagens do iframe
  const handleIframeMessage = (event: MessageEvent) => {
    // Verificar origem da mensagem por segurança
    if (event.origin !== window.location.origin) return;
    
    // Processar mensagens do iframe
    if (event.data && event.data.type === 'OUTLINE_READY') {
      setIsLoading(false);
    }
    
    if (event.data && event.data.type === 'OUTLINE_ERROR') {
      setError(event.data.error || 'Erro ao carregar documentação');
    }
  };

  useEffect(() => {
    // Configurar ouvinte de mensagens
    window.addEventListener('message', handleIframeMessage);
    
    return () => {
      // Limpar ouvinte ao desmontar componente
      window.removeEventListener('message', handleIframeMessage);
    };
  }, []);

  return (
    <div className="documentation-tab">
      {isLoading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando documentação...</p>
        </div>
      )}
      
      {error && (
        <div className="error-container">
          <h3>Erro ao carregar documentação</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Tentar novamente
          </button>
        </div>
      )}
      
      <iframe
        ref={iframeRef}
        src={outlineUrl}
        title="Documentação do Projeto"
        className={`documentation-iframe ${isLoading ? 'loading' : ''}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setError('Não foi possível carregar a documentação. Verifique sua conexão.');
        }}
        allow="clipboard-write"
      />
      
      <style jsx>{`
        .documentation-tab {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 600px;
          display: flex;
          flex-direction: column;
          background-color: var(--background-default);
        }
        
        .documentation-iframe {
          width: 100%;
          height: 100%;
          min-height: 600px;
          border: none;
          flex: 1;
          transition: opacity 0.3s ease;
        }
        
        .documentation-iframe.loading {
          opacity: 0.4;
        }
        
        .loading-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top-color: var(--color-primary);
          animation: spin 1s linear infinite;
          margin-bottom: 10px;
        }
        
        .error-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: var(--background-default);
          padding: 20px;
          border-radius: 6px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          text-align: center;
          max-width: 400px;
        }
        
        .error-container button {
          margin-top: 15px;
          padding: 8px 16px;
          background-color: var(--color-primary);
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default DocumentationTab; 