import React, { useEffect, useState } from 'react';

interface DocumentationTabProps {
  projectId: string;
  organizationSlug: string;
}

// Este componente será renderizado na aba "Documentação" dentro de um projeto
const DocumentationTab: React.FC<DocumentationTabProps> = ({ 
  organizationSlug,
  projectId
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // URL para o Outline, filtrando pela collection específica do projeto
  const outlineUrl = `/api/outline-proxy?org=${organizationSlug}&project=${projectId}`;

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
    
    // Simular carregamento finalizado após 2 segundos para demonstração
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => {
      // Limpar ouvinte ao desmontar componente
      window.removeEventListener('message', handleIframeMessage);
      clearTimeout(timer);
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
          background-color: #f8fafc;
        }
        
        .documentation-iframe {
          width: 100%;
          height: 100%;
          min-height: 600px;
          border: none;
          flex: 1;
          transition: opacity 0.3s ease;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
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
          border-top-color: #4f46e5;
          animation: spin 1s linear infinite;
          margin-bottom: 10px;
        }
        
        .error-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: white;
          padding: 20px;
          border-radius: 6px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          text-align: center;
          max-width: 400px;
        }
        
        .error-container h3 {
          margin-top: 0;
          color: #ef4444;
        }
        
        .error-container button {
          margin-top: 15px;
          padding: 8px 16px;
          background-color: #4f46e5;
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