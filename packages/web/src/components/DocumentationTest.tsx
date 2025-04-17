import React, { useState } from 'react';
import axios from 'axios';
import { Button, Alert, Spinner } from './ui';

interface DocumentationTestProps {
  organizationSlug: string;
  projectId: string;
}

/**
 * Componente para testar a integração entre Plane e Outline
 * Verifica se a documentação está configurada corretamente e permite realizar testes de conexão
 */
const DocumentationTest: React.FC<DocumentationTestProps> = ({
  organizationSlug,
  projectId
}) => {
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);

  // Realizar teste de conexão
  const runConnectionTest = async () => {
    try {
      setLoading(true);
      setTestResults(null);

      // Verificar se a documentação está configurada
      const docResponse = await axios.get(
        `/api/documentation/${organizationSlug}/projects/${projectId}`
      );

      if (!docResponse.data.success) {
        setTestResults({
          success: false,
          message: 'A documentação não está configurada para este projeto.',
        });
        return;
      }

      // Verificar autenticação com Outline
      const authResponse = await axios.get(
        `/api/outline/auth-url?organizationSlug=${organizationSlug}&collectionId=${docResponse.data.data.id}`
      );

      if (!authResponse.data.success) {
        setTestResults({
          success: false,
          message: 'Falha na geração de URL de autenticação para o Outline.',
          details: authResponse.data
        });
        return;
      }

      // Testar sincronização de permissões
      const syncResponse = await axios.post(
        `/api/documentation/${organizationSlug}/projects/${projectId}/sync-permissions`
      );

      // Resultados completos do teste
      setTestResults({
        success: true,
        message: 'Todos os testes de integração foram concluídos com sucesso!',
        details: {
          documentationId: docResponse.data.data.id,
          authUrl: authResponse.data.data.authUrl,
          syncStatus: syncResponse.data.success ? 'Sucesso' : 'Falha'
        }
      });
    } catch (error: any) {
      console.error('Erro durante o teste de integração:', error);
      setTestResults({
        success: false,
        message: error.response?.data?.message || 'Erro inesperado durante o teste.',
        details: {
          status: error.response?.status,
          data: error.response?.data
        }
      });
    } finally {
      setLoading(false);
    }
  };

  // Criar uma documentação para o projeto se não existir
  const createDocumentation = async () => {
    try {
      setLoading(true);
      setTestResults(null);

      // Obter informações do projeto
      const projectResponse = await axios.get(`/api/projects/${projectId}`);
      
      if (!projectResponse.data.success) {
        throw new Error('Não foi possível obter informações do projeto');
      }

      // Criar a documentação
      const createResponse = await axios.post(
        `/api/documentation/${organizationSlug}/projects/${projectId}`,
        {
          projectName: projectResponse.data.data.name
        }
      );

      if (createResponse.data.success) {
        setTestResults({
          success: true,
          message: 'Documentação criada com sucesso!',
          details: createResponse.data.data
        });
      } else {
        throw new Error(createResponse.data.message || 'Falha ao criar documentação');
      }
    } catch (error: any) {
      console.error('Erro ao criar documentação:', error);
      setTestResults({
        success: false,
        message: error.message || 'Erro ao criar documentação.',
        details: error.response?.data
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-xl font-medium mb-4">Teste de Integração de Documentação</h2>
      
      <div className="space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:space-x-4">
          <Button 
            onClick={runConnectionTest} 
            disabled={loading}
            className="mb-2 sm:mb-0"
          >
            {loading ? <Spinner size="sm" className="mr-2" /> : null}
            Testar Conexão
          </Button>
          
          <Button 
            onClick={createDocumentation} 
            disabled={loading}
            variant="outline"
          >
            {loading ? <Spinner size="sm" className="mr-2" /> : null}
            Criar Documentação
          </Button>
        </div>
        
        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
          <p>
            <strong>Projeto ID:</strong> {projectId}
          </p>
          <p>
            <strong>Organização:</strong> {organizationSlug}
          </p>
        </div>
      </div>
      
      {testResults && (
        <Alert 
          variant={testResults.success ? 'default' : 'destructive'} 
          title={testResults.success ? 'Teste Concluído' : 'Falha no Teste'} 
          description={testResults.message}
        >
          {testResults.details && (
            <div className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-auto max-h-40">
              <pre>{JSON.stringify(testResults.details, null, 2)}</pre>
            </div>
          )}
        </Alert>
      )}
      
      <div className="mt-6 text-sm text-gray-500">
        <h3 className="font-medium mb-2">Informações de Diagnóstico</h3>
        <p>
          Este componente verifica a configuração da documentação do projeto no Outline.
          Use os botões acima para testar a conexão ou criar uma nova documentação.
        </p>
      </div>
    </div>
  );
};

export default DocumentationTest; 