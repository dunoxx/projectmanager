import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spinner, Alert, Button } from './ui';

interface DocumentationViewerProps {
  projectId: string;
  organizationSlug: string;
}

/**
 * Componente que exibe a documentação do Outline dentro do Plane
 */
const DocumentationViewer: React.FC<DocumentationViewerProps> = ({ 
  projectId, 
  organizationSlug 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const [collectionId, setCollectionId] = useState<string | null>(null);
  const [isLinked, setIsLinked] = useState(false);

  // Buscar informações da documentação ao carregar o componente
  useEffect(() => {
    const fetchDocumentationInfo = async () => {
      try {
        setLoading(true);
        setError(null);

        // Verificar se o projeto tem documentação vinculada
        const response = await axios.get(
          `/api/documentation/${organizationSlug}/projects/${projectId}`
        );

        if (response.data.success && response.data.data) {
          setCollectionId(response.data.data.id);
          setIsLinked(true);
          
          // Gerar URL de autenticação para o Outline
          const authResponse = await axios.get(
            `/api/outline/auth-url?organizationSlug=${organizationSlug}&collectionId=${response.data.data.id}`
          );
          
          if (authResponse.data.success) {
            setAuthUrl(authResponse.data.data.authUrl);
          }
        } else {
          setIsLinked(false);
        }
      } catch (error: any) {
        console.error('Erro ao buscar informações da documentação:', error);
        setIsLinked(false);
        // Não exibimos o erro ao usuário se a documentação simplesmente não estiver vinculada
        if (error.response?.status !== 404) {
          setError('Não foi possível carregar a documentação. Tente novamente mais tarde.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentationInfo();
  }, [projectId, organizationSlug]);

  // Função para criar uma nova documentação vinculada ao projeto
  const handleCreateDocumentation = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obter informações do projeto para criar a documentação
      const projectResponse = await axios.get(
        `/api/projects/${projectId}`
      );

      if (!projectResponse.data.success) {
        throw new Error('Não foi possível obter informações do projeto');
      }

      const project = projectResponse.data.data;

      // Criar a documentação vinculada ao projeto
      const response = await axios.post(
        `/api/documentation/${organizationSlug}/projects/${projectId}`,
        {
          projectName: project.name
        }
      );

      if (response.data.success) {
        setCollectionId(response.data.data.collection.id);
        setIsLinked(true);

        // Gerar URL de autenticação para o Outline
        const authResponse = await axios.get(
          `/api/outline/auth-url?organizationSlug=${organizationSlug}&collectionId=${response.data.data.collection.id}`
        );
        
        if (authResponse.data.success) {
          setAuthUrl(authResponse.data.data.authUrl);
        }
      } else {
        throw new Error(response.data.message || 'Falha ao criar documentação');
      }
    } catch (error: any) {
      console.error('Erro ao criar documentação:', error);
      setError(error.message || 'Não foi possível criar a documentação. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Função para sincronizar permissões entre Plane e Outline
  const handleSyncPermissions = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `/api/documentation/${organizationSlug}/projects/${projectId}/sync-permissions`
      );

      if (response.data.success) {
        // Exibir notificação de sucesso ou atualizar o estado conforme necessário
        console.log('Permissões sincronizadas com sucesso');
      } else {
        throw new Error(response.data.message || 'Falha ao sincronizar permissões');
      }
    } catch (error: any) {
      console.error('Erro ao sincronizar permissões:', error);
      setError('Não foi possível sincronizar as permissões. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Se estiver carregando, mostrar spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  // Se houver erro, mostrar mensagem
  if (error) {
    return (
      <Alert 
        variant="destructive" 
        title="Erro ao carregar documentação" 
        description={error}
      />
    );
  }

  // Se não estiver vinculado a uma documentação, mostrar opção para criar
  if (!isLinked) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4 p-6 border rounded-lg">
        <h3 className="text-xl font-bold">Documentação não configurada</h3>
        <p className="text-center text-gray-600 max-w-md">
          Este projeto ainda não possui documentação integrada com o Outline.
          Clique no botão abaixo para criar uma área de documentação para este projeto.
        </p>
        <Button onClick={handleCreateDocumentation}>
          Criar Documentação
        </Button>
      </div>
    );
  }

  // Se estiver vinculado, mas não tiver URL de autenticação
  if (!authUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Alert 
          variant="warning" 
          title="Configuração incompleta" 
          description="A documentação está configurada, mas não foi possível gerar o link de acesso."
        />
        <Button onClick={() => window.location.reload()}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  // Renderizar o iframe com a documentação do Outline
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 p-2 bg-gray-50 rounded">
        <h2 className="text-lg font-medium">Documentação do Projeto</h2>
        <Button variant="outline" size="sm" onClick={handleSyncPermissions}>
          Sincronizar Permissões
        </Button>
      </div>
      
      <div className="flex-grow overflow-hidden rounded-lg border">
        <iframe
          src={authUrl}
          className="w-full h-full"
          title="Documentação do Projeto"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </div>
  );
};

export default DocumentationViewer; 