import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spinner, Alert, Button } from './ui';
import DocumentationTree from './DocumentationTree';

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
  const [activeDocument, setActiveDocument] = useState<{id: string; title: string} | null>(null);
  const [documentContent, setDocumentContent] = useState<string>('');
  const [documentLoading, setDocumentLoading] = useState(false);

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

  // Função para carregar o conteúdo de um documento específico
  const handleSelectDocument = async (documentId: string, documentTitle: string) => {
    try {
      setDocumentLoading(true);
      setActiveDocument({ id: documentId, title: documentTitle });
      
      const response = await axios.get(`/api/outline/documents/${documentId}`);
      
      if (response.data.success) {
        // Formatar o Markdown para exibição
        const content = response.data.data.text || '';
        setDocumentContent(content);
      } else {
        setDocumentContent('Não foi possível carregar o conteúdo do documento.');
      }
    } catch (error) {
      console.error('Erro ao carregar conteúdo do documento:', error);
      setDocumentContent('Erro ao carregar o conteúdo do documento.');
    } finally {
      setDocumentLoading(false);
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

  // Função para formatação básica do Markdown
  const formatMarkdown = (markdown: string): JSX.Element => {
    // Dividir o texto em linhas
    const lines = markdown.split('\n');
    
    // Processar linha por linha
    return (
      <div className="markdown">
        {lines.map((line, index) => {
          // Cabeçalhos
          if (line.startsWith('#')) {
            const headingLevel = line.match(/^#+/)?.[0].length || 1;
            const text = line.replace(/^#+\s+/, '');
            const Tag = `h${Math.min(headingLevel, 6)}` as keyof JSX.IntrinsicElements;
            return <Tag key={index} className="font-bold my-3">{text}</Tag>;
          }
          
          // Listas
          if (line.match(/^\s*[-*+]\s+/)) {
            const text = line.replace(/^\s*[-*+]\s+/, '');
            return <li key={index} className="ml-6">{text}</li>;
          }
          
          // Negrito
          if (line.includes('**') || line.includes('__')) {
            line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            line = line.replace(/__(.*?)__/g, '<strong>$1</strong>');
          }
          
          // Itálico
          if (line.includes('*') || line.includes('_')) {
            line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
            line = line.replace(/_(.*?)_/g, '<em>$1</em>');
          }
          
          // Links
          if (line.includes('[') && line.includes(']') && line.includes('(') && line.includes(')')) {
            line = line.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>');
          }
          
          // Linhas vazias são parágrafos
          if (line.trim() === '') {
            return <br key={index} />;
          }
          
          // Texto normal é parágrafo
          return <p key={index} className="my-2" dangerouslySetInnerHTML={{ __html: line }} />;
        })}
      </div>
    );
  };

  // Renderizar o layout dividido com a árvore de documentos e o conteúdo
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 p-2 bg-gray-50 rounded">
        <h2 className="text-lg font-medium">Documentação do Projeto</h2>
        <Button variant="outline" size="sm" onClick={handleSyncPermissions}>
          Sincronizar Permissões
        </Button>
      </div>
      
      <div className="flex-grow overflow-hidden flex border rounded-lg">
        {/* Painel lateral com a árvore de documentos */}
        <div className="w-1/4 border-r overflow-auto">
          {collectionId && (
            <DocumentationTree 
              projectId={projectId}
              organizationSlug={organizationSlug}
              collectionId={collectionId}
              onSelectDocument={handleSelectDocument}
            />
          )}
        </div>
        
        {/* Área principal de conteúdo */}
        <div className="w-3/4 overflow-auto">
          {activeDocument ? (
            <div className="p-4">
              {documentLoading ? (
                <div className="flex justify-center items-center h-40">
                  <Spinner size="md" />
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl font-bold mb-4">{activeDocument.title}</h1>
                  <div className="prose max-w-none">
                    {documentContent ? (
                      formatMarkdown(documentContent)
                    ) : (
                      <p className="text-gray-500">
                        Selecione um documento para ver seu conteúdo.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-4 text-gray-500">
              <p>Selecione um documento na árvore ao lado para ver seu conteúdo.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentationViewer; 