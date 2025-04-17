import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spinner, Button } from './ui';

interface Document {
  id: string;
  title: string;
  url?: string;
  children?: Document[];
  parentId?: string | null;
}

interface DocumentationTreeProps {
  projectId: string;
  organizationSlug: string;
  collectionId: string;
  onSelectDocument: (documentId: string, title: string) => void;
}

/**
 * Componente que exibe a árvore hierárquica de documentos
 * Similar ao estilo Outline, Notion ou AppFlowy
 */
const DocumentationTree: React.FC<DocumentationTreeProps> = ({
  projectId,
  organizationSlug,
  collectionId,
  onSelectDocument
}) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [expandedDocs, setExpandedDocs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDoc, setActiveDoc] = useState<string | null>(null);

  // Carregar documentos da coleção
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `/api/outline/collections/${collectionId}/documents`
        );

        if (response.data.success) {
          // Organizar documentos em uma estrutura hierárquica
          const docs = response.data.data;
          const organizedDocs = organizeDocuments(docs);
          setDocuments(organizedDocs);
          
          // Se houver documentos, expandir o primeiro nível
          if (organizedDocs.length > 0) {
            const newExpandedDocs = new Set(expandedDocs);
            organizedDocs.forEach(doc => newExpandedDocs.add(doc.id));
            setExpandedDocs(newExpandedDocs);
          }
        } else {
          throw new Error('Erro ao carregar documentos');
        }
      } catch (error) {
        console.error('Erro ao carregar documentos:', error);
        setError('Não foi possível carregar a estrutura de documentos.');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [collectionId]);

  // Organiza os documentos em uma estrutura hierárquica
  const organizeDocuments = (docs: any[]): Document[] => {
    // Mapa para armazenar documentos por ID
    const docMap = new Map();
    
    // Primeiro passo: criar o mapa de documentos
    docs.forEach(doc => {
      docMap.set(doc.id, {
        id: doc.id,
        title: doc.title,
        url: doc.url,
        parentId: doc.parentDocumentId,
        children: []
      });
    });
    
    // Segundo passo: organizar a hierarquia
    const rootDocs: Document[] = [];
    
    docMap.forEach(doc => {
      if (doc.parentId && docMap.has(doc.parentId)) {
        // Adicionar como filho ao documento pai
        const parent = docMap.get(doc.parentId);
        parent.children.push(doc);
      } else {
        // Documento de nível raiz
        rootDocs.push(doc);
      }
    });
    
    // Ordenar os documentos alfabeticamente
    return rootDocs.sort((a, b) => a.title.localeCompare(b.title));
  };

  // Alternar a expansão de um documento
  const toggleExpand = (docId: string) => {
    const newExpandedDocs = new Set(expandedDocs);
    if (expandedDocs.has(docId)) {
      newExpandedDocs.delete(docId);
    } else {
      newExpandedDocs.add(docId);
    }
    setExpandedDocs(newExpandedDocs);
  };

  // Criar um novo documento
  const handleCreateDocument = async (parentId?: string) => {
    try {
      const title = prompt('Nome do documento:');
      if (!title) return;

      const response = await axios.post('/api/outline/documents', {
        title,
        collectionId,
        parentDocumentId: parentId || null,
        text: `# ${title}\n\nAdicione seu conteúdo aqui...`
      });

      if (response.data.success) {
        // Recarregar a lista de documentos
        const docsResponse = await axios.get(
          `/api/outline/collections/${collectionId}/documents`
        );
        
        if (docsResponse.data.success) {
          const docs = docsResponse.data.data;
          const organizedDocs = organizeDocuments(docs);
          setDocuments(organizedDocs);
          
          // Expandir o documento pai se existir
          if (parentId) {
            const newExpandedDocs = new Set(expandedDocs);
            newExpandedDocs.add(parentId);
            setExpandedDocs(newExpandedDocs);
          }
          
          // Selecionar o novo documento
          onSelectDocument(response.data.data.id, title);
          setActiveDoc(response.data.data.id);
        }
      }
    } catch (error) {
      console.error('Erro ao criar documento:', error);
      alert('Não foi possível criar o documento. Tente novamente.');
    }
  };

  // Renderizar um documento na árvore
  const renderDocument = (doc: Document, level: number = 0) => {
    const isExpanded = expandedDocs.has(doc.id);
    const hasChildren = doc.children && doc.children.length > 0;
    
    return (
      <div key={doc.id} style={{ marginLeft: `${level * 12}px` }}>
        <div 
          className={`flex items-center py-1 px-2 rounded-md hover:bg-gray-100 cursor-pointer group
            ${activeDoc === doc.id ? 'bg-blue-50 text-blue-600' : ''}`}
        >
          {/* Ícone de expansão para documentos com filhos */}
          <div 
            className="mr-1 w-5 h-5 flex items-center justify-center"
            onClick={() => hasChildren && toggleExpand(doc.id)}
          >
            {hasChildren ? (
              isExpanded ? '▼' : '►'
            ) : (
              <span className="w-4"></span>
            )}
          </div>
          
          {/* Ícone de documento ou pasta */}
          <div className="mr-2 text-gray-500">
            {hasChildren ? '📁' : '📄'}
          </div>
          
          {/* Título do documento */}
          <div 
            className="flex-grow truncate"
            onClick={() => {
              setActiveDoc(doc.id);
              onSelectDocument(doc.id, doc.title);
            }}
          >
            {doc.title}
          </div>
          
          {/* Menu de ações */}
          <div className="flex items-center opacity-0 group-hover:opacity-100">
            <button 
              className="p-1 rounded-sm hover:bg-gray-200"
              onClick={() => handleCreateDocument(doc.id)}
              title="Adicionar sub-documento"
            >
              ➕
            </button>
            <button 
              className="p-1 rounded-sm hover:bg-gray-200"
              onClick={(e) => {
                e.stopPropagation();
                // Implementar menu de ações
              }}
              title="Mais ações"
            >
              ⋯
            </button>
          </div>
        </div>
        
        {/* Renderizar filhos se expandido */}
        {isExpanded && hasChildren && doc.children?.map(child => 
          renderDocument(child, level + 1)
        )}
      </div>
    );
  };

  // Mostrar spinner enquanto carrega
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spinner size="md" />
      </div>
    );
  }

  // Mostrar mensagem de erro se houver
  if (error) {
    return (
      <div className="text-red-500 p-4">
        {error}
      </div>
    );
  }

  // Renderizar a árvore de documentos
  return (
    <div className="documentation-tree bg-white rounded-md border p-2">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h3 className="font-medium text-sm">Documentos</h3>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => handleCreateDocument()}
          className="h-7 px-2"
        >
          ➕ Novo
        </Button>
      </div>
      
      <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
        {documents.length === 0 ? (
          <p className="text-gray-500 text-sm p-2">
            Nenhum documento encontrado. Crie o primeiro documento clicando no botão "Novo".
          </p>
        ) : (
          documents.map(doc => renderDocument(doc))
        )}
      </div>
    </div>
  );
};

export default DocumentationTree; 